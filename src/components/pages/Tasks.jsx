import { useState } from 'react';
import Layout from '@/components/organisms/Layout';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';

function Tasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <Layout 
      title="Tasks" 
      showSearch={true}
      onSearch={setSearchQuery}
    >
      <TaskList 
        searchQuery={searchQuery}
        onTaskSelect={handleTaskSelect}
        onAddTask={handleAddTask}
      />
      
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </Layout>
  );
}

export default Tasks;