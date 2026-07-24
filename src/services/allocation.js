const Order = require('../models/Order');
const ProductionBatch = require('../models/ProductionBatch');

/**
 * Allocates stock to a single order using FIFO (oldest production batch first).
 */
async function allocateOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status === 'dispatched' || order.status === 'cancelled') return order;

  let remaining = order.quantityOrdered - order.allocations.reduce((s, a) => s + a.quantity, 0);
  if (remaining <= 0) return order;

  const batches = await ProductionBatch.find({ product: order.product })
    .sort({ producedAt: 1 });

  for (const batch of batches) {
    if (remaining <= 0) break;
    const available = batch.quantityProduced - batch.quantityAllocated;
    if (available <= 0) continue;

    const take = Math.min(available, remaining);
    batch.quantityAllocated += take;
    await batch.save();

    order.allocations.push({ batch: batch._id, quantity: take });
    remaining -= take;
  }

  const totalAllocated = order.allocations.reduce((s, a) => s + a.quantity, 0);
  order.status = totalAllocated >= order.quantityOrdered ? 'allocated' : 'partially_allocated';
  await order.save();
  return order;
}

async function allocateAllPending() {
  const orders = await Order.find({ status: { $in: ['pending', 'partially_allocated'] } })
    .sort({ createdAt: 1 });

  const results = [];
  for (const order of orders) {
    results.push(await allocateOrder(order._id));
  }
  return results;
}

module.exports = { allocateOrder, allocateAllPending };
