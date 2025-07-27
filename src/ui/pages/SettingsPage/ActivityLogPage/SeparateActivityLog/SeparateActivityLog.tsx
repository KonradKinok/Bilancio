interface SeparateActivityLogProps {
  index: number;
  activity: ActivityLog;
}

export const SeparateActivityLog: React.FC<SeparateActivityLogProps> = ({
  index,
  activity,
}) => {
  return (
    <tr>
      <td>{String(index + 1).padStart(5, "0")}</td>
      <td>{activity.Date}</td>
      <td>{activity.UserName}</td>
      <td>{activity.ActivityType}</td>
      <td>
        <pre>{activity.ActivityData}</pre>
      </td>
    </tr>
  );
};
