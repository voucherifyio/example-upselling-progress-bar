import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalOfferTwoToneIcon from '@mui/icons-material/LocalOfferTwoTone';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DiscountIcon from '@mui/icons-material/Discount';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { ProgressThreshold } from '../upselling-progress-bar';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(99,33,242) 0%,rgb(99,33,242)50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(99,33,242) 0%, rgb(99,33,242) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LocalOfferOutlinedIcon />,
    2: <LocalOfferTwoToneIcon />,
    3: <LocalOfferIcon />,
    4: <DiscountIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)] || <DiscountIcon />}
    </ColorlibStepIconRoot>
  );
}



type CustomizedSteppersProps = {
  value: number,
  thresholds: ProgressThreshold[]
};

export default function CustomizedSteppers(props: CustomizedSteppersProps) {

  const activeStep = props.thresholds.filter(t => t.value < props.value).length - 1;

  return (
    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
      
      {props.thresholds.sort((a, b) => a.value - b.value).map((threshold) => (
        <Step key={threshold.promotionBaner}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>
            <Stack>
              <b>Spend ${threshold.value / 100}</b>
              {threshold.promotionBaner}
            </Stack>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
