import Head from "next/head";
import Image from 'next/image';
import { Typography, Button, Link } from "@mui/material";
import styles from '../styles/Home.module.css';

const Fallback = () => (
  <>
    <Head>
      <title>Lost Internet Connectivity</title>
    </Head>
    <div className={styles.main}>
      <span className={styles.logo}>
        <Image src="/lost_connection.png" alt="Lost connection" width={400} height={400} />
      </span>
      <div className="container--align-centered">
        <h2>Oops, it appears you are offline!</h2>
      </div>  
      <Typography flexGrow={1} align="center">
        <Link href="/user" passHref>  
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ width: "300px", borderRadius: "12px" }}
          >
            Back to Splitas
          </Button>
        </Link>
      </Typography>
    </div>
  </>
);

export default Fallback;
