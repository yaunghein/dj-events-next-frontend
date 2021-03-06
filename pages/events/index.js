import { Layout, EventItem, Pagination } from '@dj-components'
import { API_URL, PER_PAGE } from '@dj-config/index'
import { motion } from 'framer-motion'
import { parent } from '@dj-animation/stagger-slideIn'

export default function EventPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>

      {events.length === 0 && <h3>No events to show.</h3>}

      <motion.div variants={parent} initial='hidden' animate='visible'>
        {events.map((evt, index) => (
          <EventItem key={evt.id} evt={evt} index={index} />
        ))}
      </motion.div>

      <Pagination page={page} total={total} />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { page = 1 } = context.query
  //calculating start index
  const start = (+page - 1) * PER_PAGE

  //fetching total events count
  const totalResp = await fetch(`${API_URL}/events/count`)
  const total = await totalResp.json()

  //fetching events
  const eventsResp = await fetch(`${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`)
  const events = await eventsResp.json()

  return {
    props: {
      events,
      page: +page,
      total,
    },
  }
}
