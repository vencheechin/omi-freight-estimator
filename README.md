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
- Air: anything under 1 kg is charged as 1 kg.
- Sea: the weight is rounded to the nearest kg (at least 1 kg).
- AUD estimate = total RMB ÷ (AUD→CNY rate − 0.05 transfer buffer), to the nearest dollar. The rate is the European Central Bank's daily rate from Frankfurter (api.frankfurter.dev), with ExchangeRate-API (open.er-api.com) as a backup and `xeRate` in settings.json if neither loads.
- Arrival = today + time to order and send to the warehouse + air or sea transit.

## Change the rates for everyone

Edit `settings.json` on GitHub and commit. Everyone sees the new rates the next time they open the page.

| Field | Meaning | Default |
| --- | --- | --- |
| `airRate` | Air freight, RMB per kg | 55 |
| `seaRate` | Sea freight, RMB per kg | 13 |
| `divisor` | Volumetric divisor (cm³ per kg) | 5000 |
| `airMinKg` | Air minimum charge, kg | 1 |
| `rateMode` | `live` (daily ECB rate) or `manual` (use `xeRate`) | live |
| `xeRate` | Manual rate, RMB per 1 AUD | 4.49 |
| `fxBuffer` | Transfer cost buffer taken off the Xe rate, RMB | 0.05 |
| `order` | Time to order and send to the warehouse | 1 week |
| `air` | Air transit from China | 7 days |
| `sea` | Sea transit from China | 2 months |

Durations are `{ "n": number, "u": "days" | "weeks" | "months" }`.

The Admin settings panel on the page can try other rates on one device only. Its "Copy settings.json"
button copies the current values, ready to paste into `settings.json` on GitHub.

## Releasing a change to the page

Bump `VERSION` in `sw.js` (for example `freight-v1` → `freight-v2`) whenever files are added or
removed, so installed copies refresh.
