import React, { useState } from 'react'
import Button from './button'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  if (!isOpen) return null;

  const handleClose = () => {
    if (title || description || deadline) {
      setShowConfirm(true);
    } else {
      clearErrors();
      onClose();
    }
  };

  const clearTextFields = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
  }

  const clearErrors = () => {
    setErrors({
      title: "",
      description: "",
      deadline: ""
    })
  }

  const confirmClose = () => {
    setShowConfirm(false);
    clearTextFields();
    clearErrors();
    onClose();
  };

  const validateForm = () => {
    let isValid: boolean = true;
    const newErrors = {
      title: "",
      description: "",
      deadline: ""
    };
    const newDate: Date = new Date(deadline)

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!deadline) {
      newErrors.deadline = "Deadline is required";
      isValid = false;
    }

    if (newDate < new Date()) {
      newErrors.deadline = "Deadline cannot be set on past dates"
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const createID = () => {

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const [year, month, day] = deadline.split('-')
    const formatDL = `${month}/${day}/${year}`

    console.log(Date.now())

    const jsonTask = localStorage.getItem("myData")
    // json file exist in storage
    if (jsonTask !== null) {
      const data = JSON.parse(jsonTask)
      const newTask = { 
        task_id: "T" + Date.now() + (data.length + 1),
        task_name: title,
        task_desc: description,
        date_added: new Date(),
        task_dl: formatDL,
        status: "Pending"
      }

      data.push(newTask)
      localStorage.setItem("myData", JSON.stringify(data))
      
      alert("Task added successfully.")
    } else if (jsonTask === null) { // json file does not exist
      const newTask = [{
        task_id: 1,
        task_name: title,
        task_desc: description,
        date_added: new Date(),
        task_dl: formatDL,
        status: "Pending"
      }]

      localStorage.setItem("myData", JSON.stringify(newTask))

      alert("Task added successfully.")
    } else {
      alert("Task not added successfully.")
    }

    clearTextFields();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-70"></div>
      {/* Confirmation modal */}
      {showConfirm ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50 relative">
          <h2 className="text-xl mb-4">Discard changes?</h2>
          <p className="mb-4">Are you sure you want to discard your new task?</p>
          <div className="flex justify-end gap-2">
            <Button 
              btnTitle="Cancel" 
              btnColor="" 
              onClick={() => setShowConfirm(false)} />
            <Button 
              btnTitle="Discard" 
              btnColor="Red" 
              onClick={confirmClose} />
          </div>
        </div>
      ) : ( // Main Add Modal
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] z-50 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add New Task</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors({...errors, title: ''});
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors({...errors, description: ''});
                  }
                }}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) {
                    setErrors({...errors, deadline: ''});
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                btnTitle="Cancel" 
                btnColor=""
                onClick={handleClose} />
              <button type="submit" className="hover:cursor-pointer bg-cust-yellow hover:bg-yellow-500 py-2 px-4 rounded-lg transition duration-200">Add Task</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Modal;