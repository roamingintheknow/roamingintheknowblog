// pages/view/[slug].js
// import Preview from '../components/views/Preview';
import dynamic from 'next/dynamic';
import { fetchAllPublishedPostsFromMongo, fetchPostBySlug } from '@/lib/blogs';
import { Blog } from '@/types/blog';
import { GetStaticProps, GetStaticPropsContext } from 'next';

const Preview = dynamic(() => import('../components/views/Preview'), { ssr: false });

export async function getStaticPaths() {
  const posts = await fetchAllPublishedPostsFromMongo();
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
}
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const slug = Array.isArray(context?.params?.slug) ? context.params.slug[0] : context?.params?.slug ?? "";
  const blog = await fetchPostBySlug(slug);
  if (!blog) {
    return { notFound: true };
  }
  const cleanBlog = JSON.parse(JSON.stringify(blog));
  return {
    props: {
      blog: cleanBlog
    }
  };
}

const ViewBlog = ({ blog }: { blog: Blog }) => {
  if (!blog) return <p>Blog not found.</p>;
  return (
    <div>
      <Preview blog={blog} />
    </div>
  );
};

export default ViewBlog;





// // pages/view/[slug].js
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Preview from '../components/views/Preview';

// export async function getStaticPaths() {
//   const posts = await fetchAllPublishedPostsFromMongo();
//   const paths = posts.map(post => ({
//     params: { slug: post.slug },
//   }));

//   return {
//     paths,
//     fallback: 'blocking', // or true if you want loading states
//   };
// }

// export async function getStaticProps({ params }) {
//   const post = await fetchPostBySlug(params.slug);

//   if (!post) {
//     return { notFound: true };
//   }

//   return {
//     props: { post },
//     revalidate: 60, // seconds: revalidates after the first request in production
//   };
// }


// const ViewBlog=() =>{
//   const router = useRouter();
//   const { slug } = router.query;
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchBlog() {
//       if (slug) {
//         try {
//           const response = await fetch(`/api/blogs/${slug}`);
//           const data = await response.json();
//           if (response.ok) {
//             setBlog(data.blog);
//           } else {
//             console.error('Failed to fetch blog:', data.error);
//           }
//         } catch (error) {
//           console.error('Error fetching blog:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     }

//     fetchBlog();
//   }, [slug]);

//   if (loading) return <p>Loading...</p>;
//   if (!blog) return <p>Blog not found.</p>;

//   return (
//     <div>
//       <Preview blog={blog}/>
//     </div>
//   );
// }
// export default ViewBlog;