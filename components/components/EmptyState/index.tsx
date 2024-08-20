const EmptyState = ({ icon, label }) => (
  <div className="flex flex-col mt-[126px] gap-4 text-trunks items-center">
    {icon}
    <p>{label}</p>
  </div>
);

export default EmptyState;
