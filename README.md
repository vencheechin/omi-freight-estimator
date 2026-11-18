# OMI Freight Cost Estimator

Works out the total cost (product cost + shipping fee) and arrival time by air and sea for goods shipped from the China warehouse.

Live copy: https://vencheechin.github.io/omi-freight-estimator/

## How it calculates

- Enter the actual weight (kg). Optionally enter the carton length, width and height (cm).
- Volumetric weight = Length × Width × Height ÷ 5,000.
- The charge uses whichever is higher: actual or volumetric weight.
- Enter the product cost (RMB).
- Shipping fee = charged kg × air or sea rate.
- Total cost = product cost + shipping fee, rounded to the nearest RMB.
- Air: anything under 1 kg is charged as 1 kg. Under 20 kg costs RMB 60/kg; 20 kg and over costs RMB 55/kg (one rate for the whole shipment).
- Sea: the weight is rounded to the nearest kg (at least 1 kg).
- AUD estimate = total RMB ÷ (AUD→CNY rate − 0.05 transfer buffer), to the nearest dollar. The rate is the European Central Bank's daily rate from Frankfurter (api.frankfurter.dev), with ExchangeRate-API (open.er-api.com) as a backup and `xeRate` in settings.json if neither loads.
- Arrival = today + procurement time to place the order (1 day) + supplier delivery to the warehouse (5 working days, weekends skipped) + air or sea transit.

## Change the rates for everyone

Edit `settings.json` on GitHub and commit. Everyone sees the new rates the next time they open the page.

| Field | Meaning | Default |
| --- | --- | --- |
| `airRateSmall` | Air freight under the weight break, RMB per kg | 60 |
| `airTierKg` | Air weight break, kg (this weight and over uses `airRate`) | 20 |
| `airRate` | Air freight at the weight break and over, RMB per kg | 55 |
| `seaRate` | Sea freight, RMB per kg | 13 |
| `divisor` | Volumetric divisor (cm³ per kg) | 5000 |
| `airMinKg` | Air minimum charge, kg | 1 |
| `rateMode` | `live` (daily ECB rate) or `manual` (use `xeRate`) | live |
| `xeRate` | Manual rate, RMB per 1 AUD | 4.49 |
| `fxBuffer` | Transfer cost buffer taken off the Xe rate, RMB | 0.05 |
| `order` | Procurement team to place the order | 1 day |
| `supplier` | Supplier to send to the warehouse | 5 working days |
| `air` | Air transit from China | 7 days |
| `sea` | Sea transit from China | 2 months |

Durations are `{ "n": number, "u": "days" | "workdays" | "weeks" | "months" }` (`workdays` skips Saturdays and Sundays).

The Admin settings panel on the page can try other rates on one device only. Its "Copy settings.json"
button copies the current values, ready to paste into `settings.json` on GitHub.

## Releasing a change to the page

Bump `VERSION` in `sw.js` (for example `freight-v1` → `freight-v2`) whenever files are added or
removed, so installed copies refresh.
