import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), 'posts')

export const getSortedPostsData = () => {
  // Get the file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id 
    const id = fileName.replace(/\.md$/, '')


    // Read mark down file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matchResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matchResult.data
    }
  })
  // Sort posts by data
  return allPostsData.sort((a, b) => {
    if (a.data > b.date) {
      return 1
    } else {
      return -1
    }
  })

}

export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory)
  
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export const getPostData = async (id) => {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};