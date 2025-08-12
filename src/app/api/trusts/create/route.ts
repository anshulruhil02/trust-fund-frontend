// src/app/api/trusts/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      purpose,
      contractAddress,
      creatorAddress,
      beneficiaries, // [{ address, allocation, name?, email? }]
      trustees,      // [{ address, name?, email?, permissions }]
      payoutSettings // { frequency, amount, currency, method, firstPaymentDate }
    } = body;

    // Validate required fields
    if (!name || !purpose || !contractAddress || !creatorAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { walletAddress: creatorAddress }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: creatorAddress,
        }
      });
    }

    // Create trust with all related data in a transaction
    const trust = await prisma.$transaction(async (tx) => {
      // Create the trust
      const newTrust = await tx.trust.create({
        data: {
          name,
          purposeStatement: purpose,
          contractAddress,
          creatorUserId: user.id,
          payoutFrequency: payoutSettings?.frequency || 'MONTHLY',
          payoutAmount: payoutSettings?.amount || 0,
          payoutCurrency: payoutSettings?.currency || 'USD',
          payoutMethod: payoutSettings?.method || 'IN_KIND',
          firstPaymentDate: payoutSettings?.firstPaymentDate,
        }
      });

      // Add beneficiaries
      for (const beneficiary of beneficiaries || []) {
        // Create or find beneficiary user
        let beneficiaryUser = await tx.user.findUnique({
          where: { walletAddress: beneficiary.address }
        });

        if (!beneficiaryUser) {
          beneficiaryUser = await tx.user.create({
            data: {
              walletAddress: beneficiary.address,
              email: beneficiary.email,
            }
          });
        }

        await tx.beneficiary.create({
          data: {
            trustId: newTrust.id,
            userId: beneficiaryUser.id,
            name: beneficiary.name,
            email: beneficiary.email,
            allocationPercent: beneficiary.allocation,
          }
        });
      }

      // Add trustees
      for (const trustee of trustees || []) {
        // Create or find trustee user
        let trusteeUser = await tx.user.findUnique({
          where: { walletAddress: trustee.address }
        });

        if (!trusteeUser) {
          trusteeUser = await tx.user.create({
            data: {
              walletAddress: trustee.address,
              email: trustee.email,
            }
          });
        }

        await tx.trustee.create({
          data: {
            trustId: newTrust.id,
            userId: trusteeUser.id,
            name: trustee.name,
            email: trustee.email,
            permissions: trustee.permissions || {},
            status: 'ACTIVE',
            confirmedAt: new Date(),
          }
        });
      }

      // Add creator as trustee if not already included
      const creatorIsTrustee = trustees?.some((t: { address: string; }) => t.address.toLowerCase() === creatorAddress.toLowerCase());
      if (!creatorIsTrustee) {
        await tx.trustee.create({
          data: {
            trustId: newTrust.id,
            userId: user.id,
            permissions: {
              dissolve: true,
              adjustPayouts: true,
              manageTrustees: true,
              emergencyWithdraw: true
            },
            status: 'ACTIVE',
            confirmedAt: new Date(),
          }
        });
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          trustId: newTrust.id,
          userId: user.id,
          action: 'TRUST_CREATED',
          description: `Trust "${name}" created`,
          metadata: {
            contractAddress,
            beneficiaryCount: beneficiaries?.length || 0,
            trusteeCount: trustees?.length || 0,
          }
        }
      });

      return newTrust;
    });

    return NextResponse.json({
      success: true,
      trust: {
        id: trust.id,
        name: trust.name,
        contractAddress: trust.contractAddress,
        createdAt: trust.createdAt,
      }
    });

  } catch (error) {
    console.error('Error creating trust:', error);
    return NextResponse.json(
      { error: 'Failed to create trust' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's trusts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        trustsCreated: {
          include: {
            beneficiaries: {
              include: {
                user: true
              }
            },
            trustees: {
              include: {
                user: true
              }
            },
            deposits: true,
            _count: {
              select: {
                proposals: true,
                deposits: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ trusts: [] });
    }

    return NextResponse.json({
      trusts: user.trustsCreated
    });

  } catch (error) {
    console.error('Error fetching trusts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trusts' },
      { status: 500 }
    );
  }
}