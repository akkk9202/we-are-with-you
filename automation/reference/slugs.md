# Reference — Partner slugs (load-bearing — never rename)

The object keys in `js/partners.js`. Printed on physical QR codes and linked from old URLs. To change
what shows publicly, edit the **`name`** field — never the key.

| Slug (key) | Visible `name` | `order` |
|---|---|---|
| `cancer-care` | City of Hope Atlanta (CTCA) | 1 |
| `ronald-mcdonald-house` | Ronald McDonald House | 2 |
| `nicu` | Northside Intensive Care Unit (NICU) | 3 |
| `senior-living` | Senior Living | 4 |
| `disability` | The America Wheat Mission (Milal) | 5 |
| `schools-global` | Schools & Global Communities | 6 |

Each slug becomes a page at `partner.html?p=SLUG`, plus a homepage card, a Programs card, a nav
dropdown item, and a footer link — all rendered automatically.

Adding a partner → use a **new** slug and `order`; see `../templates/partner-entry.md` and
`../workflows/add-partner.md`.
