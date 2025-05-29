
interface DashboardHeaderProps {
  currentDate: Date;
}

const DashboardHeader = ({ currentDate }: DashboardHeaderProps) => {
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="text-xl text-gray-600 mb-8 font-medium text-center">
      {capitalizedDate}
    </div>
  );
};

export default DashboardHeader;
