import styles from './mdres.module.css'

import { parseLastValue } from '../../utils/parseJSON/parsejson';
import { ModelResponseProps } from '../../types/mdr';

export const Mdres: React.FC<ModelResponseProps> = ({ data }) => {

  const lastStatus = parseLastValue(data.machine_status);
  const lastTimeToFailure = parseLastValue(data.time_to_failure_hours);


  const formattedTime = !isNaN(Number(lastTimeToFailure))
    ? Number(lastTimeToFailure).toFixed(2)
    : lastTimeToFailure;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Результат предсказания</h3>
      <div className={styles.row}>
        <span className={styles.label}>Статус машины:</span>
        <span className={`${styles.value} ${lastStatus === 'CRITICAL' ? styles.critical : styles.optimal}`}>
          {lastStatus}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Время до поломки (часов):</span>
        <span className={styles.value}>{formattedTime}</span>
      </div>
    </div>
  );
};