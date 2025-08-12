// src/app/api/deposits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      trustId,
      depositorAddress,
      tokenAddress,
      tokenSymbol,
      amount,
      transactionHash,
      blockNumber
    } = body;

    // Validate required fields
    if (!trustId || !depositorAddress || !tokenAddress || !tokenSymbol || !amount || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or find depositor user
    let user = await prisma.user.findUnique({
      where: { walletAddress: depositorAddress }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: depositorAddress,
        }
      });
    }

    // Create deposit record
    const deposit = await prisma.$transaction(async (tx) => {
      const newDeposit = await tx.deposit.create({
        data: {
          trustId,
          depositorUserId: user.id,
          tokenAddress,
          tokenSymbol,
          amount: amount.toString(),
          transactionHash,
          blockNumber: blockNumber ? BigInt(blockNumber) : null,
          status: 'CONFIRMED',
          confirmedAt: new Date(),
        }
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          trustId,
          userId: user.id,
          action: 'DEPOSIT_MADE',
          description: `Deposited ${amount} ${tokenSymbol}`,
          metadata: {
            tokenAddress,
            tokenSymbol,
            amount,
            transactionHash,
          }
        }
      });

      return newDeposit;
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        tokenSymbol: deposit.tokenSymbol,
        createdAt: deposit.createdAt,
      }
    });

  } catch (error) {
    console.error('Error recording deposit:', error);
    return NextResponse.json(
      { error: 'Failed to record deposit' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch trust deposits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trustId = searchParams.get('trustId');

    if (!trustId) {
      return NextResponse.json(
        { error: 'Trust ID required' },
        { status: 400 }
      );
    }

    const deposits = await prisma.deposit.findMany({
      where: { trustId },
      include: {
        depositor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ deposits });

  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}