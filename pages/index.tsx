import Head from 'next/head'
import Header from "../Components/Header";
import {sanityClient, urlFor} from "../sanity"
import {Post} from "../typings";
import Link from "next/link";

interface Props {
    posts: [Post]
}

export default function Home({posts}: Props) {

    return <div className={"max-w-7xl mx-auto"}>
        <Head>
            <title>Blog App</title>
        </Head>
        <Header/>

        <div className={"flex h-[500px] justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0"}>
            <div className={"px-10 space-y-5"}>
                <h1 className={"text-6xl max-w-xl font-serif"}>
                    <span className={"underline decoration-black decoration-4"}>Blogging</span> is a place to write,read
                    and connect
                </h1>
                <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
            </div>
            <img className={"hidden md:inline-flex h-32 lg:h-[250px] mr-32"}
                 src={"https://www.freepnglogos.com/uploads/b-letter-logo-png/b-letter-file-font-svg-wikimedia-commons-34.png"}
                 alt={""}/>
        </div>
        {/*Posts*/}
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:py-6"}>
            {
                posts.map((post) => {
                    return <Link href={`/post/${post.slug.current}`} key={post._id}>
                        <div className={"border rounded-lg group cursor-pointer overflow-hidden"}>
                            <img className={"w-full h-60 object-cover group-hover:scale-105 transition-transform decoration-200 ease-in-out"}
                                 src={urlFor(post.mainImage).url()!} alt={""}/>
                            <div className={"flex justify-between p-5 bg-white"}>
                                <div>
                                    <p className={"text-lg font-bold"}>{post.title}</p>
                                    <p className={"text-xs"}>{post.description} by <span className={"underline text-base"}>{post.author.name}</span></p>
                                </div>
                                <img className={"w-12 h-12 rounded-full"}
                                     src={urlFor(post.author.image).url()!} alt={""}/>
                            </div>
                        </div>
                    </Link>
                })
            }
        </div>

    </div>
}

export const getServerSideProps = async () => {
    const query = `*[_type=="post"]{
   _id,
   title,
   author->{
   name,
   image
 },
 description,
 mainImage,
 slug
}`;
    const posts = await sanityClient.fetch(query);

    return {
        props: {
            posts,
        }
    }
}

