'use client';
import * as React from 'react';
import { ToastProvider, useToast, Button, Icon } from '@afex/xds-react';

function Triggers() {
  const toast = useToast();
  return (
    <div className="demo">
      <Button variant="primary" icon={<Icon.Check size="sm" />}

        onClick={() => toast({ tone: 'success', title: 'Order placed',
          message: '250 MT Maize White at ₦344,720.00/MT.' })}>
        Place order
      </Button>
      <Button icon={<Icon.Clock size="sm" />}
        onClick={() => toast({ tone: 'info', title: 'Prices are delayed',
          message: 'This board shows a 15-minute delay on your plan.' })}>
        Show delay
      </Button>
      <Button icon={<Icon.Pause size="sm" />}
        onClick={() => toast({ tone: 'warning', title: 'Live updates paused',
          message: 'The board is holding still while you read.',
          action: { label: 'Resume', onClick: () => {} } })}>
        Pause board
      </Button>
      <Button variant="danger" icon={<Icon.Danger size="sm" />}
        onClick={() => toast({ tone: 'danger', title: 'Order rejected',
          message: 'Insufficient wallet balance.',
          action: { label: 'Top up wallet', onClick: () => {} } })}>
        Reject order
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return <ToastProvider><Triggers /></ToastProvider>;
}
