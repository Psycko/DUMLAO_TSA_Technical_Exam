import { useState, useEffect } from 'react'
import Button from '../components/button'

interface Task {
    task_id: number;
    task_name: string;
    task_desc: string;
    date_added: string;
    task_dl: string;
    status: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskDetails: Task;
}

const viewModal = ({ isOpen, onClose, taskDetails }: ModalProps) => {
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true); 
    const [modalTitle, setModalTitle] = useState<string>("View Task");
    const [title, setTitle] = useState<string>(taskDetails?.task_name || "");
    const [description, setDescription] = useState<string>(taskDetails?.task_desc || "");
    const [deadline, setDeadline] = useState<string>("");
    const [showUpdateConfirm, setShowUpdateConfirm] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        deadline: ""
    });

    if (!isOpen) return null;

    // set the value of task title, description, and deadline
    useEffect(() => {
        if (taskDetails && isOpen) {
            setTitle(taskDetails.task_name);
            setDescription(taskDetails.task_desc);
            // Convert MM/DD/YYYY to YYYY-MM-DD for date input
            const [month, day, year] = taskDetails.task_dl.split('/');
            setDeadline(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
    }, [taskDetails, isOpen]);

    const handleClose = () => {
        if (!isDisabled && hasChanges()) {
            setShowConfirm(true);
        } else {
            resetForm();
            onClose();
        }
    };

    const hasChanges = () => {
        const [month, day, year] = taskDetails.task_dl.split('/');
        const originalDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return title !== taskDetails.task_name || 
               description !== taskDetails.task_desc || 
               deadline !== originalDate;
    };

    const handleCancel = () => {
        if (hasChanges()) {
            setShowConfirm(true);
        } else {
            setIsDisabled(true);
            setModalTitle("View Task");
            resetForm();
        }
    };

    const resetForm = () => {
        if (taskDetails) {
            setTitle(taskDetails.task_name);
            setDescription(taskDetails.task_desc);
            const [month, day, year] = taskDetails.task_dl.split('/');
            setDeadline(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
        clearErrors();
    }

    const clearErrors = () => {
        setErrors({
            title: "",
            description: "",
            deadline: ""
        });
    }

    const validateForm = () => {
        let isValid: boolean = true;
        const newErrors = {
            title: "",
            description: "",
            deadline: ""
        };
        const newDate: Date = new Date(deadline);

        if (!title?.trim()) {
            newErrors.title = "Title is required";
            isValid = false;
        }

        if (!description?.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }

        if (!deadline) {
            newErrors.deadline = "Deadline is required";
            isValid = false;
        }

        if (newDate < new Date()) {
            newErrors.deadline = "Deadline cannot be set on past dates";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!hasChanges()) {
            alert("No changes were made")
            return;
        }

        setShowUpdateConfirm(true);
    };

    const confirmUpdate = () => {
        const [year, month, day] = deadline.split('-')
        const formatDL = `${month}/${day}/${year}`

        const jsonTask = localStorage.getItem("myData")
        if (jsonTask !== null) {
            const data = JSON.parse(jsonTask)
            const updatedData = data.map((task: Task) => {
                if (task.task_id === taskDetails.task_id) {
                    return {
                        ...task,
                        task_name: title,
                        task_desc: description,
                        task_dl: formatDL
                    };
                }
                return task;
            });

            localStorage.setItem("myData", JSON.stringify(updatedData))
            alert("Task updated successfully.")
        } else {
            alert("Error updating task.")
        }

        setShowUpdateConfirm(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-70"></div>
        {/* Discard Changes Confirmation Modal */}
        {showConfirm ? (
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50 relative">
                <h2 className="text-xl mb-4">Discard changes?</h2>
                <p className="mb-4">Are you sure you want to discard your changes?</p>
                <div className="flex justify-end gap-2">
                    <Button 
                        btnTitle="Cancel" 
                        btnColor="" 
                        onClick={() => setShowConfirm(false)} 
                    />
                    <Button 
                        btnTitle="Discard" 
                        btnColor="Red" 
                        onClick={() => {
                            resetForm();
                            setShowConfirm(false);
                            setIsDisabled(true);
                        }}
                    />
                </div>
            </div>
        ) : showUpdateConfirm ? (
            /* Update Confirmation Modal */
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-50 relative">
                <h2 className="text-xl mb-4">Confirm Update</h2>
                <p className="mb-4">Are you sure you want to update this task?</p>
                <div className="flex justify-end gap-2">
                    <Button 
                        btnTitle="Cancel" 
                        btnColor="" 
                        onClick={() => setShowUpdateConfirm(false)} 
                    />
                    <Button 
                        btnTitle="Update" 
                        btnColor="Yellow" 
                        onClick={confirmUpdate}
                    />
                </div>
            </div>
        ) : (
            /* Main View/Edit Modal */
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] z-50 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{modalTitle}</h2>
                <button 
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    disabled={isDisabled}
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) {
                            setErrors({...errors, title: ''});
                        }
                    }}
                    className={`disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 w-full px-3 py-2 border rounded-md ${
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
                    disabled={isDisabled}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                            setErrors({...errors, description: ''});
                        }
                    }}
                    rows={4}
                    className={`disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 w-full px-3 py-2 border rounded-md ${
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
                    disabled={isDisabled}
                    onChange={(e) => {
                        setDeadline(e.target.value);
                        if (errors.deadline) {
                            setErrors({...errors, deadline: ''});
                        }
                    }}
                    className={`disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 w-full px-3 py-2 border rounded-md ${
                        errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>
                {isDisabled ? (   
                    <div className="flex justify-end gap-2">
                        <Button 
                            btnTitle="Close" 
                            btnColor=""
                            onClick={handleClose} 
                        />
                        <Button 
                            btnTitle="Edit Task" 
                            btnColor="Yellow"
                            onClick={() => {
                                setIsDisabled(false);
                                setModalTitle("Edit Task");
                            }} 
                        />
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button"
                            className="px-4 py-2 rounded-lg transition duration-200 bg-gray-200 hover:bg-gray-300"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="hover:cursor-pointer bg-cust-yellow hover:bg-yellow-500 py-2 px-4 rounded-lg transition duration-200"
                        >
                            Update Task
                        </button>
                    </div>
                )}
            </form>
            </div>
        )}
        </div>
    );
}

export default viewModal