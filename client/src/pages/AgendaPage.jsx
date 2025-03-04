import 'react-calendar/dist/Calendar.css';
import Agenda from "@/components/Agenda";
import Navbar from '../components/Navbar';

export default function AgendaPage() {
  return (
    <>
      <Navbar />
      <section className='p-2'>
        <Agenda/>
      </section>
    </>
  )
}
