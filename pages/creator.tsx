import type { NextPage } from "next"
import Head from "next/head"

import { CreatorForm } from "@components/CreatorForm"

const Creator: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Creator</title>
        <meta name="description" content="Creator" />
      </Head>

      <main>
        <CreatorForm />
      </main>
    </div>
  )
}

export default Creator
