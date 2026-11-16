# MedVision frontend

MedVision is a React 19 and Vite frontend prototype for a medical imaging and research platform. The current imaging focus is brain MRI; chest and bone X-rays are future-scope categories.

## Run locally

```sh
npm install
npm run dev
```

The project also provides `npm run lint` and `npm run build`.

## Main frontend areas

- Public site: `/`, `/about`, `/features`, `/how-it-works`, `/contact`
- Demo sign-in and role selection: `/login` and `/register`
- Patient portal: `/patient`
- Researcher portal: `/researcher`

Both portals have separate navigation and role-specific pages. Navigation and role selection are frontend demonstrations only; they are not authentication or authorization.

## Prototype and privacy boundaries

- No backend APIs, database, authentication service, or machine-learning model are connected.
- Do not enter real patient details or select private medical images in this demo.
- MRI preview and progress are local browser-only demonstrations; no file is uploaded or saved.
- Analysis results, confidence values, reports, research cases, and analytics are intentionally empty or labelled placeholders. No clinical predictions or synthetic patient records are shown.
- Researcher interfaces are designed to contain only consented, de-identified, authorized cases when a secure backend exists. The UI does not enforce consent or access permissions.
