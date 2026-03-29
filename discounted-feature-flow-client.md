# Discounted Feature (Referral Reward) - Client Flow

## Goal
Encourage customers to invite others, and reward them when those invites become successful purchases.

## Simple Flow
1. A customer receives or creates an invite link/code.
2. They share it with friends or family.
3. A new customer uses that invite and places an order successfully.
4. The invite is counted as a successful referral.
5. After reaching the target (example: 5 successful referrals), the inviter gets a reward (example: 1 extra key).
6. The inviter receives a confirmation that the reward was added.

## What Counts as a Successful Invite
- The invited person must complete a valid purchase.
- Only completed purchases are counted.
- If needed, we can define how cancellations/refunds should affect the count.

## Reward Example
- Rule: Invite 5 successful buyers.
- Reward: Get 1 extra key.
- Then repeat: every next 5 successful invites gives another extra key (if approved).

## Admin Management Flow
- Admin can create and update referral reward campaigns.
- Admin can set the threshold (for example, 5 invites).
- Admin can define the reward (for example, 1 extra key).
- Admin can activate/pause campaigns.
- Admin can view:
  - total invites,
  - successful invites,
  - rewards already granted.

## Customer Experience
- Customers can clearly see progress (for example: 3 of 5 completed).
- Customers get notified when:
  - a referral is successful,
  - they unlock a reward.

## Open Questions for Final Approval
1. Should the inviter be required to have already placed at least one order before they can earn referral rewards?
2. Should self-invites be blocked (same person inviting themselves)?
3. Should only first-time buyers count as valid invited customers?
4. If an invited order is refunded/cancelled, should that referral be removed from the count?
5. Should rewards expire, or remain valid forever?
6. Can one invited customer count more than once (multiple orders), or only once?
7. Do we want one active campaign only, or multiple campaigns at the same time?
8. Should there be a maximum rewards cap per inviter?

## Suggested Default Policy (for quick launch)
- Inviter must have at least one completed order.
- Self-invites are not allowed.
- Only first completed order from each invited customer counts.
- Refunded/cancelled invited orders do not count.
- One active campaign at a time.
