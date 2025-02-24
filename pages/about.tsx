import StickyHeader from './components/nav/StickyHeader';
import {AboutPage} from './components/views/AboutPage';
import {AboutContent} from './components/views/AboutContent';

export default function About() {
  return(
    <div>
      <StickyHeader page="about"/>
      <AboutPage/>
    </div>
  )

}