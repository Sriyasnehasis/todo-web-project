import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
  toggleTask,
  Task,
} from "../api/taskAPI";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [tag, setTag] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing">("all");
  const [file, setFile] = useState<File | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔐 check login

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // ✅ check if token exists

    if (token) {
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch tasks");
    }
  };

  const handleAdd = async () => {
      if (!isLoggedIn) {
  alert("You must be logged in to add a task.");
  return;
}


    if (!title.trim() || !priority) {
      alert("Please enter a title and priority");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("priority", priority.toLowerCase());
      formData.append("tags", tag);
      if (file) formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/todos/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ include token if needed
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      setTasks((prev) => [...prev, data.todo]);
      setTitle("");
      setCategory("Work");
      setPriority("medium");
      setTag("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      console.error(e);
      alert("Error deleting task");
    }
  };

  const handleToggle = async (id: string, done: boolean) => {
    try {
      const updated = await toggleTask(id, done);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: updated.completed } : t))
      );
    } catch (e) {
      console.error(e);
      alert("Error updating task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "ongoing" && !task.completed);

    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;

    return matchesStatus && matchesCategory && matchesPriority;
  });

  return (
 <div className="w-full max-w-screen-2xl mx-auto px-6 py-6">

    <div className="flex flex-col lg:flex-row gap-10 w-full">




      {/* 👈 Task Form */}
      <div className="lg:w-5/12 w-full">

        {isLoggedIn ? (
          <div className="bg-white/60 backdrop-blur border border-white/30 rounded-2xl p-6 shadow-md space-y-4">
            <input
              type="text"
              placeholder="Enter task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Other</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              type="text"
              placeholder="Enter tag (e.g., home, urgent)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="text-center text-red-500 bg-white/40 p-4 rounded-xl shadow-md">
            🔒 Please <strong>login</strong> to add new tasks.
          </div>
        )}
      </div>

      {/* 👉 Filters + Task List */}
      <div className="lg:w-7/12 w-full space-y-4">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-2">
            {["all", "completed", "ongoing"].map((f) => (
              <button
                key={f}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === f
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
                onClick={() => setFilter(f as any)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
  key={task._id}
  className="flex justify-between items-start bg-white/80 backdrop-blur p-2 rounded-xl shadow-sm border border-white/30 hover:shadow-md transition text-sm"
>

              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleToggle(task._id, e.target.checked)}
                  className="mr-2"
                />
                <span
                  className={
                    task.completed
                      ? "line-through text-slate-400 font-medium"
                      : "text-slate-800 font-medium"
                  }
                >
                  {task.title}
                </span>
                <div className="text-[10px] text-gray-500">

                  {task.category} • {task.priority} • {task.tags?.join(", ")}
                </div>
                {task.filePath && (
                  <a
                    href={`http://localhost:5000${task.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1 block"
                  >
                    View Uploaded File
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

};

export default TaskList;
