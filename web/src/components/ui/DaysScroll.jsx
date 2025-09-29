import { Chip, Caption, Text, Subheadline } from '@telegram-apps/telegram-ui';
import useTelegram from '@hooks/useTelegram';
import Scrollable from '@components/layout/Scrollable';
import { formatDate } from '@helpers/time';

const DaysScroll = ({ days, selectedDate, onDateSelect }) => {
  const { themeParams: theme } = useTelegram().WebApp;

  return (
    <Scrollable>
      {days.map((date, index) => {
        const [week, day] = formatDate(date);
        return (
          <Chip
            key={index}
            mode='mono'
            onClick={() => onDateSelect(date)}
            style={{
              padding: '4px',
              background: date.toDateString() === selectedDate.toDateString() 
                ? theme.button_color 
                : 'none',
              minWidth: '110px',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Caption style={{ color: theme.text_color }} level='2'>{week}</Caption>
              <Subheadline style={{ color: theme.text_color }}>{day}</Subheadline>
            </div>
          </Chip>
        );
      })}
    </Scrollable>
  );
};

export default DaysScroll;