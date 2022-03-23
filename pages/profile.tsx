import type { NextPage } from "next"
import Head from "next/head"

import { ProfileGrid } from "@components/ProfileGrid"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile" />
      </Head>

      <main>
        <ProfileGrid />
      </main>
    </div>
  )
}

export default Home
