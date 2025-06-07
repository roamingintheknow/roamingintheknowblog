import HomePage from './components/views/HomePage';
import { getRecentBlogs } from '@/lib/getRecentBlogs';
import { getPopularBlogs } from '@/lib/getPopularBlogs';
import { Blog } from '@/types/blog';

export const getStaticProps = async () => {
  const recentBlogs = await getRecentBlogs(8);
  const popularBlogs = await getPopularBlogs(8);
  const cleanRecentBlogs = JSON.parse(JSON.stringify(recentBlogs));

  const cleanPopularBlogs = JSON.parse(JSON.stringify(popularBlogs));
  return {
    props: {
      recentBlogs: cleanRecentBlogs,
      popularBlogs: cleanPopularBlogs
    }

    // revalidate: 60, // Optional: update every 60s
  };
};

export default function Main({recentBlogs, popularBlogs}: { recentBlogs: Blog[],popularBlogs: Blog[] }) {
  return <HomePage recentBlogs={recentBlogs} popularBlogs={popularBlogs}/>;
}
