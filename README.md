# Tanayote Foods — Order Processing System (v0 prototype)

A working prototype: order intake (manual / B2B / WhatsApp-tagged), FIFO stock
allocation across production batches, raw material tracking, supplier
registry, and a dashboard. Built to run against your own MongoDB Atlas
cluster, deployed on Railway.

## What's working
- Create orders (manual, B2B-tagged for Pick n Pay / Trophies with 5-day SLA, or WhatsApp-tagged)
- Record production batches and raw material usage
- FIFO allocation: oldest production batch is drawn down first when filling orders
- Dispatch orders once allocated
- Raw material stock + low-stock flagging
- Supplier registry + broadcast composer (logs the message — swap in a real WhatsApp/SMS API later)
- A simple browser dashboard at `/` to click through all of the above

## Local run
npm install
cp .env.example .env   # then paste your MONGODB_URI in
npm start
# open http://localhost:3000

## What's simplified for this v0
- No auth yet — fine for a private test, not for production
- B2B API endpoint accepts a source: 'b2b_api' tag, not a live Pick n Pay/Trophies integration yet
- WhatsApp intake is a tag on the order, not a live WhatsApp webhook yet
- Broadcast composer logs the message instead of sending it
