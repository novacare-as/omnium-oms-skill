# GUI Export and Import

Source: https://docs.omnium.no/docs/Integrations/gui-export-import

> Manual data export and import using Omnium's UI in JSON and Excel formats for transferring information between systems.

## Omnium Data Import & Export

### JSON Format

You can use JSON to export and import data with external systems such as inventory management, CRM, e-commerce platforms, and shipping providers. JSON provides a structured format for exchanging data and supports automated processes and API integrations.

### Use Cases

*   **Data Transfer**: Move data between environments.
*   **Debugging**: Extract and modify data for troubleshooting.
*   **Integration**: Sync Omnium data with external applications.

### Exporting JSON Data

1.  Go to **Configuration → Export → JSON**.
2.  Select the document type.
3.  Enter the document IDs (comma-separated or line break).
4.  Click **Export** to download the JSON file.

![Export Interface](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgui_export.cb83416c.jpg&w=3840&q=75)

### Importing JSON Data

1.  Go to **Configuration → Export → JSON**.
2.  Select the document type.
3.  Paste the raw JSON content into the **Data** field.
4.  Click **Import**.

![Export Interface](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgui_import.921d6891.jpg&w=3840&q=75)

**Note:** Importing data will replace existing documents with the same ID in Omnium.

### Excel

Importing data from Excel files provides a straightforward way to manage data without requiring coding or API integrations. Users can map Excel headers to Omnium properties, ensuring data is imported correctly. This method is useful for working with structured data in a familiar spreadsheet format.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimport_excel.6cb31d44.jpg&w=3840&q=75)
