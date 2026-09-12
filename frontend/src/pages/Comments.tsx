import { useState } from "react"
import { createComment, deleteComment, getComments } from "../services/comments"

function Comments() {
  const [taskId, setTaskId] = useState("")
  const [content, setContent] = useState("")
  const [comments, setComments] = useState<any[]>([])

  async function load() {
    if (!taskId.trim()) return

    try {
      const data = await getComments(taskId)
      setComments(data.comments || [])
    } catch (error) {
      console.error(error)
    }
  }

  async function add() {
    if (!taskId.trim() || !content.trim()) {
      alert("Enter task ID and comment")
      return
    }

    try {
      await createComment(content, taskId)
      setContent("")
      await load()
    } catch (error) {
      console.error(error)
      alert("Could not add comment")
    }
  }

  async function remove(id: string) {
    await deleteComment(id)
    await load()
  }

  return (
    <main>
      <h1>Comments</h1>

      <section>
        <input
          placeholder="Task ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />

        <button onClick={load}>Load Comments</button>

        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={add}>Add Comment</button>
      </section>

      {comments.map((comment) => (
        <section key={comment.id}>
          <p>{comment.content}</p>
          <button onClick={() => remove(comment.id)}>Delete</button>
        </section>
      ))}
    </main>
  )
}

export default Comments
