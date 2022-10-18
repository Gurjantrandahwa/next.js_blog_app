import Header from "../../Components/Header";
import {sanityClient, urlFor} from "../../sanity";
import {Post} from "../../typings";
import {GetStaticProps} from "next";
import PortableText from "react-portable-text";
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";

interface Props {
    post: Post;
}

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

function Post({post}: Props) {
    console.log(post)
    const [submitted, setSubmitted] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        await fetch("/api/createComments", {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data)
            setSubmitted(true)
        }).catch((err) => {
            console.log(err)
            setSubmitted(false)
        })
    }
    return <main>
        <Header/>
        <img className={"w-full h-40 object-cover"}
             src={urlFor(post.mainImage).url()!} alt={""}/>

        <article className={"max-w-3xl mx-auto p-5"}>
            <h1 className={"text-3xl mt-6 mb-3"}>
                {post.title}
            </h1>
            <h2 className={"text-xl font-light text-gray-500 mb-2"}>
                {post.description}
            </h2>
            <div className={"flex items-center space-x-2"}>
                <img className={"h-10 w-10 rounded-full"}
                     src={urlFor(post.author.image).url()!} alt={""}/>
                <p className={"font-light text-sm"}>
                    Blog post by <span className={"text-green-600"}>{post.author.name}</span> - Published at{""}
                    {new Date(post._createdAt).toLocaleString()}
                </p>
            </div>
            <div className={"mt-10"}>
                <PortableText
                    className=""
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    content={post.body}
                    serializers={
                        {
                            h1: (props: any) => (
                                <h1 className={"text-2xl font-bold my-5"} {...props}/>
                            ),
                            h2: (props: any) => (
                                <h1 className={"text-xl font-bold my-5"} {...props}/>
                            ),
                            li: ({children}: any) => (
                                <li className={"ml-4 list-disc"}>{children}</li>
                            ),
                            link: ({href, children}: any) => (
                                <a href={href}
                                   className={"text-blue-500 hover:underline"}>
                                    {children}
                                </a>
                            ),
                        }
                    }
                />
            </div>
        </article>
        <hr className={"max-w-2xl my-5 mx-auto border-t border-yellow-500"}/>

        {
            submitted ? (

                <div className={"flex flex-col p-10 my-10 bg-yellow-500 text-white mx-auto max-w-2xl "}>
                    <h3 className={"text-2xl font-bold "}>
                        Thank you submitting your comment!
                    </h3>
                    <p className={"text-lg"}>
                        Once it approved,it will show below!
                    </p>
                </div>

            ) : (


                <form onSubmit={handleSubmit(onSubmit)}
                      className={"flex flex-col p-5 max-w-2xl mx-auto mb-10"}>

                    <h3 className={"text-amber-500 text-sm "}>Enjoyed the article?</h3>
                    <h4 className={"text-3xl font-bold mb-3"}>Leave a comment below!</h4>
                    <hr className={"py-3 "}/>
                    <input
                        {...register("_id")}
                        type={"hidden"}
                        name={"_id"}
                        value={post._id}
                    />

                    <label className={"block "}>
                        <span className={"text-gray-700"}>Name</span>
                        <input
                            {...register("name", {required: true})}
                            type={"name"}
                            className={"shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring  "}
                            placeholder={"John"}/>
                    </label>
                    <div>
                        {
                            errors.name && (
                                <span className={"text-red-500"}>-The name is required</span>
                            )
                        }
                    </div>

                    <label className={"block mt-4"}>
                        <span className={"text-gray-700"}>Email</span>
                        <input
                            {...register("email", {required: true})}
                            type={"email"}
                            className={"shadow border rounded py-2 px-3 form-input  block w-full ring-yellow-500 outline-none focus:ring  "}
                            placeholder={"john123@gmail.com"}/>
                    </label>
                    <div className={""}>
                        {
                            errors.email && (
                                <span className={"text-red-500 mb-2"}>-The email is required</span>
                            )
                        }
                    </div>

                    <label className={"block mt-4"}>
                        <span className={"text-gray-700"}>Comment</span>
                        <textarea
                            {...register("comment", {required: true})}
                            className={"shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring  "}
                            rows={8}
                            placeholder={"John"}/>
                    </label>
                    <div>
                        {
                            errors.comment && (
                                <span className={"text-red-500"}>-The comment is required</span>
                            )
                        }
                    </div>

                    <input type={"submit"}
                           className={"mt-3 shadow bg-yellow-500 rounded hover:bg-yellow-400 focus:outline-none" +
                               " cursor-pointer px-4 py-2 font-bold "}
                    />
                </form>
            )

        }

        {/*Comments*/}
        <div className={"flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2"}>

            <h3 className={"text-3xl"}>Comments</h3>
            <hr className={"pb-2"}/>
            {
                post.comments.map((comment) => {
                    return <div key={comment._id}>
                        <p>
                          <span className={"text-yellow-500"}>{comment.name} </span> :
                            {" " +
                                ""}   {comment.comment}
                        </p>
                    </div>
                })
            }
        </div>
    </main>
}

export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type=="post"]{
  _id,
  slug{
  current
}
}`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current,
        },
    }))

    return {
        paths,
        fallback: 'blocking'
    }
};
export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `*[_type=="post" && slug.current== $slug][0]{
  _id,
  _createdAt,
  title,
  author->{
  name,
  image
},
'comments':*[
_type == "comment" && 
post._ref == ^._id && 
approved == true],
description,
mainImage,
slug,
body

}`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            post,
        }
    }
}


