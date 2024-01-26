import "../app/globals.css";

import styles from "./page.module.css";
import UpsellingProgress from '../components/progress'
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { ProgressThreshold } from '../upselling-progress-bar';
import { Slider } from "@mui/material";

function valuetext(value: number) {
  return `$${value/100}`;
}

export default function Home() {
  const initCartTotal = 14000
  const [cartTotal, setCartTotal] = useState<number>(initCartTotal)
  const [progressThresholds, setProgressThresholds] = useState<ProgressThreshold[]>([])
  
  useEffect(() => {
    (async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-progress`, { method: 'POST' })
      setProgressThresholds(await response.json())
    })()
  }, [])
  
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Upselling progress bar</h1>

        <div>
          <a
            href="https://voucherify.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            Voucherify
          </a>
        </div>
      </div>
      <div className={styles.center}>

        <Typography variant="body1" gutterBottom>
          This is an example implementation of UI component for a store, showcasing promotions as part of an upselling campaign conducted using Voucherify. The component, in the form of a progress bar, displays promotions achievable for the customer based on the total value of the shopping cart. This solution can be easily adapted to other scenarios where validation rules are based on the same criteria, such as the number of ordered products.
        </Typography>
        <Typography variant="body1" gutterBottom>
          This example requires configured Voucherify promotion tiers that:


        </Typography>
        <ul>
          <li>have the metadata &apos;upselling-progress-bar set to &apos;true&apos;,</li>
          <li>have only one validation rule based on the order value and the &apos;more_than&apos; condition.</li>
        </ul>

      </div>
      <div className={styles.center}>
        <UpsellingProgress thresholds={progressThresholds} value={cartTotal} />
      </div>
      <div className={styles.center}>
        <Typography variant="body1" gutterBottom>
          Cart value
        </Typography>
        <Slider
          aria-label="Temperature"
          defaultValue={initCartTotal}
          valueLabelFormat={valuetext}
          valueLabelDisplay="on"
          step={1000}
          onChange={(a, newValue) => setCartTotal(newValue as number)}
          marks
          min={0}
          max={80000}
        />
      </div>
    </main>
  );
}
