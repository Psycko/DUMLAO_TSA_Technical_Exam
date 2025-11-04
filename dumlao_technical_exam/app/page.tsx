"use client"
import React, { useState, useEffect } from 'react'
import Button from "./components/button"
import AddModal from "./components/addModal"
import EditModal from "./components/viewModal"
import Chip from "./components/chip"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Task {
  task_id: number;
  task_name: string;
  task_desc: string;
  date_added: string;
  task_dl: string;
  status: string;
}

export default function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // stores task id
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const getTasks = () => {
    const jsonTask = localStorage.getItem('myData');
    if (jsonTask) {
      setTasks(JSON.parse(jsonTask));
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const verifyStatus = () => {
    // creates an array by checking which task_id is in the selectedTasks array
    const selectedTasksData = tasks.filter(task => selectedTasks.includes(task.task_id))
    // uses the first task in the array to check if all selected tasks have the same status
    const allSameStatus = selectedTasksData.every(task => task.status === selectedTasksData[0].status);
    if (!allSameStatus) {
      alert("Selected tasks must have the same status to update them together.");
      return;
    } else if (selectedTasksData.every(task => task.status === "Completed")) { // checks if a completed task is selected
      alert("Completed Tasks cannot be updated.");
      return;
    }

    setShowUpdateModal(true);
  }

  const updateStatus = () => {
    const updatedTasks = tasks.map(task => {
      if (selectedTasks.includes(task.task_id)) {
        return {
          ...task,
          status: "Completed"
        };
      }
        return task;
    });

    localStorage.setItem('myData', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setShowUpdateModal(false);
  }

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleRowClick = (id: number) => {
    if (selectedTasks.length !== 0) {
      return;
    }

    const task = tasks.find(t => t.task_id === id);
    if (task) {
      setSelectedTask(task);
      setIsViewModalOpen(true);
    }
  }

  const deleteTask = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.task_id));
    localStorage.setItem('myData', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setShowDeleteModal(false);
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsViewModalOpen(false)
    getTasks()
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <h1 className="font-[family-name:var(--font-arvo)] text-5xl mb-8">just do it.</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | "Pending" | "Completed")}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white shadow-md"
          >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
          </select>
          
          {selectedTasks.length > 0 && (
            <div className="flex gap-2">
              <Button
                btnTitle="Delete"
                btnColor="Red"
                onClick={() => setShowDeleteModal(true)}
              />
              <Button
                btnTitle="Update Status"
                btnColor="Yellow"
                onClick={verifyStatus}
              />
            </div>
          )}
        </div>
        <div>
          <Button
            btnTitle="Add Task" 
            btnColor="Yellow"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      <div className="flex space-x-4 w-full">
        <div className="mt-4 rounded-lg overflow-hidden bg-white shadow-md w-full">
          <table className="min-w-full table-fixed">
            <thead className="">
              <tr className="text-left rounded-2xl">
                <th className="p-2 text-center w-12">
                  <input
                    type="checkbox"
                    checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTasks(tasks.map(task => task.task_id));
                      } else {
                        setSelectedTasks([]);
                      }
                    }}
                  />
                </th>
                <th className="px-2 py-4 w-20">Task ID</th>
                <th className="px-2 py-4 w-60">Task Name</th>
                <th className="px-2 py-4 min-w-[290px] max-w-[290px] table-fixed">Description</th>
                <th className="px-2 py-4 w-32">Date Added</th>
                <th className="px-2 py-4 w-32">Deadline</th>
                <th className="p-2 text-center w-32">Status</th>
              </tr>
            </thead>
            <tbody> 
              {tasks.filter(task => filter === "All" ? true : task.status === filter)
                .map(task => (
                  <tr key={task.task_id} className="hover:bg-gray-100 transition duration-200 hover:cursor-pointer">
                    <td className="text-center w-12 ">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.task_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTasks([...selectedTasks, task.task_id]);
                          } else {
                            setSelectedTasks(selectedTasks.filter(id => id !== task.task_id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-2 w-20" onClick={() => handleRowClick(task.task_id)}>
                      <div className="truncate">{task.task_id}</div>
                    </td>
                    <td className="p-2 w-48" onClick={() => handleRowClick(task.task_id)}>
                      <div className="truncate">{task.task_name}</div>
                    </td>
                    <td className="p-2 min-w-[320px] max-w-[320px]" onClick={() => handleRowClick(task.task_id)}>
                      <div className="truncate">{task.task_desc}</div>
                    </td>
                    <td className="p-2 w-32" onClick={() => handleRowClick(task.task_id)}>
                      <div className="truncate">{new Date(task.date_added).toLocaleDateString()}</div>
                    </td>
                    <td className="p-2 w-32" onClick={() => handleRowClick(task.task_id)}>
                      <div className="truncate">{task.task_dl}</div>
                    </td>
                    <td className="p-2 w-32 text-center" onClick={() => handleRowClick(task.task_id)}><Chip chipText={task.status}/></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md w-80 h-80 flex flex-col items-center justify-center">
          <div className="relative">
            <Doughnut
              data={{
                labels: ['Pending', 'Completed'],
                datasets: [
                  {
                    data: [
                      tasks.filter(task => task.status === 'Pending').length,
                      tasks.filter(task => task.status === 'Completed').length
                    ],
                    backgroundColor: ['rgb(191 219 254)', 'rgb(187 247 208)'],
                    borderColor: ['rgb(147 197 253)', 'rgb(134 239 172)'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
                
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold">
                  {tasks.filter(task => task.status === 'Completed').length} / {tasks.length}
                </div>
                <div className="text-sm text-gray-500">Completed Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddModal 
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* View/Edit Task Modal */}
      {selectedTask && (
        <EditModal 
          isOpen={isViewModalOpen}
          onClose={() => {
            closeModal();
            setSelectedTask(null);
          }}
          taskDetails={selectedTask}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50">
            <h2 className="text-xl mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete the selected task(s)?</p>
            <div className="flex justify-end gap-2">
              <Button
                btnTitle="Cancel"
                btnColor=""
                onClick={() => setShowDeleteModal(false)}
              />
              <Button
                btnTitle="Delete"
                btnColor="Red"
                onClick={deleteTask}
              />
            </div>
          </div>
        </div>
      )}

      {/* Update Status Confirmation Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50">
            <h2 className="text-xl mb-4">Update Status</h2>
            <p className="mb-4">Update the status of selected task(s)?</p>
            <div className="flex justify-end gap-2">
              <Button
                btnTitle="Cancel"
                btnColor=""
                onClick={() => setShowUpdateModal(false)}
              />
              <Button
                btnTitle="Update"
                btnColor="Yellow"
                onClick={updateStatus}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
