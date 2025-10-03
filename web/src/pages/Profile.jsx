import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { Switch, Title, Modal, Cell, Section, Caption, Text, IconButton, Button, Divider, Textarea, Subheadline } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useBackButton from '@hooks/useBackButton';
import useApiCall from '@hooks/useApiCall';
import useSlots from '@hooks/useSlots';

import DaysScroll from '@components/ui/DaysScroll';
import TimeSlotsGrid from '@components/ui/TimeSlotsGrid';
import Space from '@components/layout/Space';
import Scrollable from '@components/layout/Scrollable';

import InfoPage from '@pages/Info';
import schema from '@schemas/booking';
import ServiceCard from '@components/ui/ServiceCard';
import { MapPin, Send } from 'react-feather';
import RatingBadge from '@components/ui/RatingBadge';
import FeedbackBadge from '@components/ui/FeedbackBadge';
import FeedbackCard from '../components/ui/FeedbackCard';

export default () => {
  const { account, subscription, trial } = useAuth();
  const { api } = useMetacom();
  const { profileId } = useParams();
  const location = useLocation();
  const isPreview = !!profileId && location.pathname.startsWith('/preview');
  const { ref, resetRef } = useAuth();
  const refProfileId = ref?.split('_')[1];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, showAlert, showConfirm, openLink } = WebApp;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const feedbacksRef = useRef(null);

  const scrollToFeedbacks = () => {
    feedbacksRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useBackButton(isPreview && '/workspace');

  const [selectedSlot, setSlot] = useState(null);
  const [selectedService, setService] = useState(null);

  const openModal = useCallback(() => {
    HapticFeedback.selectionChanged();
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    HapticFeedback.selectionChanged();
    setIsModalOpen(false);
    setSlot(null);
  }, []);

  const profileCallMethod = !isPreview && (refProfileId || profileId) ? 'profile.byId' : 'profile.my'
  const { call: getProfile, data: profile, loading: profileLoading } = 
    useApiCall(profileCallMethod, { autoFetch: false, params: { profileId } });

  useEffect(() => {
    getProfile({ profileId: refProfileId || profileId });
    //return resetRef;
  }, [ref]);

  const isOwner = profile?.accountId === account.accountId;
  const noSlots = profile?.availableSlots?.length === 0;

  const { call: getServices, data: services, loading: servicesLoading } =
    useApiCall('service.byProfile', { autoFetch: false });

  useEffect(() => {
    if (profile) getServices({ profileId: profile.profileId });
  }, [profile])

  const {
    selectedDate,
    setSelectedDate,
    showFullDay,
    setShowFullDay,
    days,
    timeSlots,
    slots,
    slotsLoading,
    loadSlots
  } = useSlots(profile);

  useEffect(() => {
    if (isModalOpen) {
      loadSlots(selectedDate);
    }
  }, [isModalOpen, selectedDate, loadSlots]);

  const defaultValues = {
    accountId: account?.accountId,
    profileId: profile?.profileId,
    slotId: '',
    serviceId: '',
    comment: '',
  };
  
  const formMethods = useForm({ 
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  });
  
  const { formState: { errors }, handleSubmit, reset, watch, trigger, setValue } = formMethods;

  useEffect(() => {
    const { profileId } = profile || {};
    const { slotId } = selectedSlot || {};
    const { serviceId } = selectedService || {};
    reset({
      ...defaultValues,
      profileId,
      slotId,
      serviceId,
    });
    trigger();
  }, [profile, selectedService, selectedSlot]);

  useEffect(() => void trigger(), [trigger]);

  console.log(watch())

  const handleDateSelect = useCallback((date) => {
    HapticFeedback.impactOccurred('light');
    setSelectedDate(date);
  }, [HapticFeedback]);

  const handleSlotClick = useCallback(async (time, slot) => {
    HapticFeedback.impactOccurred('soft');
    if (slot) setSlot(slot);
    //closeModal();
  }, [selectedDate]);

  const handleServiceSelect = (service) => {
    HapticFeedback.impactOccurred('light');
    setService(service);
    if (service.serviceId !== selectedService?.serviceId) setSlot(null);
    openModal();
  };

  const handleToggleFullDay = useCallback(() => {
    setShowFullDay(prev => !prev);
  }, [setShowFullDay]);

  const handleBooking = useCallback(async (booking) => {
    HapticFeedback.impactOccurred('light');
    setLoading(true);
    const created = await api.booking.create(booking);
    if (created) {
      showAlert(t('popup.alert.booking.success', { context: selectedService?.autoConfirm ? 'auto' : 'pending' }));
      navigate(`/bookings/${created?.bookingId}`);
    } else {
      showAlert(t('popup.alert.booking.failed'));
    }
    setLoading(false);
  }, [selectedService]);

  const [isProfileSended, setIsProfileSended] = useState(false);
  const handleSendProfile = useCallback(async () => {
    HapticFeedback.impactOccurred('light');
    const args = { accountId: account.accountId, profileId: profile.profileId }
    const ok = await api.profile.sendToChat(args);
    if (ok) {
      setIsProfileSended(true);
      showAlert(t('popup.alert.profile.sended'));
    }
  }, [profile, account]);

  const [fullDescription, setFulldescription] = useState(false);
  const renderDescription = (description) => {
    const more = <Text style={{ color: theme.link_color }}>{` ...${t('common.more')}`}</Text>
    const text = fullDescription || description?.length <= 75 ? description : `${description?.slice(0, 75)} `;
    const toggle = () => {
      HapticFeedback.selectionChanged();
      setFulldescription(!fullDescription);
    }
    return (
      <div onClick={toggle}>
        <Text 
          style={{ 
            whiteSpace: 'pre-wrap', 
            color: fullDescription ? theme.text_color : theme.sutitle_text_color 
          }}
        >
          {text}
        </Text>
        {fullDescription || description?.length <= 75 ? null : more}
      </div>
    )
  };

  const openMapLink = () => {
    showConfirm(t('popup.confirm.profile', { context: 'map' }), (ok) => {
      if (ok)  openLink(profile?.mapLink, { try_instant_view: true })
    });
  };

  const renderButtons = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {profile?.mapLink && 
        <IconButton onClick={openMapLink}>
          <MapPin />
        </IconButton>
      }
      <IconButton disabled={isProfileSended} onClick={handleSendProfile}>
        <Send />
      </IconButton>
    </div>
  );

  if (profileLoading) return <InfoPage type='loading'/>;

  return (
    <>
      {isIos && <Space />}

      <Section style={{ width: '100%', marginBottom: '8px' }}>
        <div style={{ width: '100%', background: theme.secondary_bg_color, display: 'flex', flexDirection: 'column' }}>
          <img src={profile?.photo} style={imageStyle} />
          <Cell
            style={{ background: theme.secondary_bg_color }}
            multiline
            subtitle={
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <RatingBadge rating={profile?.rating}/>
                <FeedbackBadge count={profile?.feedbacks?.length} onClick={scrollToFeedbacks}/>
              </div>
            }
            subhead={profile?.specialization}
            after={renderButtons()}
            description={noSlots && <Caption style={{ color: theme.destructive_text_color }}>{t('profile.noSlots')}</Caption>}
          >
            <Title level='2' weight='2'>{profile?.name}</Title>
          </Cell>
        </div>
       {profile?.address &&
          <Cell
            style={{ background: theme.secondary_bg_color }}
            subhead={t('profile.address')}
            multiline
          >
            {profile.address}
          </Cell>
       }
        <Cell
          style={{ background: theme.secondary_bg_color }}
          multiline
        >
          {renderDescription(profile?.description)}
        </Cell>
      </Section>

      {!!services?.length && 
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '100%', padding: '12px 12px 0 12px' }}>
              <Subheadline caps weight='2'>{t('profile.services')}</Subheadline>
          </div>
          {services.map((s) => (
            <ServiceCard
              key={s.serviceId}
              service={s}
              isOwner={false}
              selected={selectedService?.serviceId === s.serviceId}
              selectedSlot={selectedSlot}
              onHandleSelect={() => handleServiceSelect(s)}
            />
          ))}
        </div>
      }

      {profile?.feedbacks?.length > 0  && 
        <div ref={feedbacksRef} style={{ width: '100%', dispaly: 'flex', flexDirection: 'column' }}>
       
          <div style={{ padding: '18px 12px 12px 12px' }}>
            <Subheadline caps weight='2'>{t('profile.feedbacks')}</Subheadline>
          </div>

          <Scrollable>
            {profile?.feedbacks.map((feedback) => <FeedbackCard key={`fedback_${feedback.feedbackId}`} feedback={feedback}/>)}
          </Scrollable>
        </div>
      }

      <Space />
     
      <Modal
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
        header={<Modal.Header>{t('profile.slots')}</Modal.Header>}
        style={{
          maxHeight: '80vh',
          background: theme.secondary_bg_color,
          padding: '12px 12px 40px 12px'
        }}
      >
        <div style={{ width: '100%', padding: '12px 0' }}>
          <DaysScroll
            days={days}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
        
        <TimeSlotsGrid
          forBooking={true}
          timeSlots={timeSlots}
          slots={slots}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          selectedService={selectedService}
          showFullDay={showFullDay}
          onSlotClick={handleSlotClick}
          onToggleFullDay={handleToggleFullDay}
        />

        <br />
        <Section style={{ width: '100%' }}>
          <Textarea 
            placeholder={t('form.booking.placeholder.comment')}
            onChange={({ target }) => setValue('comment', target.value)}
            value={watch('comment')}
            status={watch('comment')?.length > 250 ? 'error' : 'default'}
          />
        </Section>

        {!isPreview && !isOwner && 
          <>
            <br />
            <Divider />
            <br />
            <Button
              loading={loading}
              stretched={true}
              mode='filled'
              size='l'
              disabled={watch('comment')?.length > 250 || Object.keys(errors).length > 0}
              onClick={handleSubmit(handleBooking)}
            >
              {t('button.booking')}
            </Button>
          </>
       }
      </Modal>
    </>

  )
};

const imageStyle = {
  objectFit: 'cover',
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: '10px 10px 0 0',
  padding: 0,
  margin: 0,
  bottom: 0,
};

