// components/ReactionRating.tsx

import { Input } from '@/components';
import { Bad } from '@/components/icons/bad';
import { BadSelected } from '@/components/icons/bad-selected';
import { Good } from '@/components/icons/good';
import { GoodSelected } from '@/components/icons/good-selected';
import { Great } from '@/components/icons/greate';
import { GreatSelected } from '@/components/icons/greate-selected';
import { Okay } from '@/components/icons/okay';
import { OkaySelected } from '@/components/icons/okay-selected';
import { Terrible } from '@/components/icons/terrible';
import { TerribleSelected } from '@/components/icons/terrible-selected';

export enum Rating {
  TERRIBLE = '-2',
  BAD = '-1',
  OKAY = '0',
  GOOD = '1',
  GREAT = '2'
}

const reactions = [
  {
    id: Rating.TERRIBLE,
    label: 'Terrible',
    icon: <Terrible />,
    selectedIcon: <TerribleSelected />
  },
  {
    id: Rating.BAD,
    label: 'Bad',
    icon: <Bad />,
    selectedIcon: <BadSelected />
  },
  {
    id: Rating.OKAY,
    label: 'Okay',
    icon: <Okay />,
    selectedIcon: <OkaySelected />
  },
  {
    id: Rating.GOOD,
    label: 'Good',
    icon: <Good />,
    selectedIcon: <GoodSelected />
  },
  {
    id: Rating.GREAT,
    label: 'Great',
    icon: <Great />,
    selectedIcon: <GreatSelected />
  }
];

type Props = {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
};

export const ReactionRating = ({ field }: Props) => {
  return (
    <div className="flex justify-between gap-2">
      {reactions.map(reaction => {
        const isSelected = field.value === reaction.id;

        return (
          <label
            key={reaction.id}
            htmlFor={reaction.id.toString()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl p-3 transition`}
          >
            <Input
              id={reaction.id}
              type="radio"
              checked={isSelected}
              onChange={() => field.onChange(reaction.id)}
              className="hidden"
            />
            <span className="text-2xl">
              {isSelected ? reaction.selectedIcon : reaction.icon}
            </span>
            <span className="text-sm">{reaction.label}</span>
          </label>
        );
      })}
    </div>
  );
};
