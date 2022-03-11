import Link from "next/link"

export const TheHeader = () => {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/marketplace">
          <a>Marketplace</a>
        </Link>
      </li>
      <li>
        <Link href="/creator">
          <a>Creator</a>
        </Link>
      </li>
      <li>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      </li>
    </ul>
  )
}