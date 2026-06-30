# MyGuns Database Schema (Auto-Synced)

## Table: guns
| Column Name | Data Type | Nullable | Default |
| :--- | :--- | :--- | :--- |
| id | bigint | NO | nextval('guns_id_seq'::regclass) |
| userId | text | NO |  |
| name | text | NO |  |
| caliber | text | NO |  |
| type | text | YES |  |
| created_at | timestamp with time zone | YES | now() |
| mfg_name | text | YES |  |
| year_produced | integer | YES |  |
| reload_eligible | boolean | YES | false |
| year_purchased | integer | YES |  |
| appraised_value | integer | YES |  |
| appraisal_year | integer | YES |  |
| appraisal_source | text | YES |  |
| appraisal_contact_name | text | YES |  |
| appraisal_contact_email | text | YES |  |
| appraisal_contact_phone | text | YES |  |
| resale_contact_name | text | YES |  |
| resale_contact_email | text | YES |  |
| resale_contact_phone | text | YES |  |
| purchase_method | text | YES |  |
| highlights | text | YES |  |
| date_purchased | date | YES |  |
| purchased_from | text | YES |  |
| image_urls | ARRAY | YES |  |
| serial_number | text | YES |  |