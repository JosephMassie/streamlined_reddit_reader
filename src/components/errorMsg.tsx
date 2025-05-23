import clsx from 'clsx';
import { HTMLProps } from 'react';

type Props = HTMLProps<HTMLDivElement> & {
    msg: string;
};

const ErrorMsg: React.FC<Props> = ({ msg, className }) => {
    return (
        <div
            className={clsx('text-3xl', {
                [className ?? '']: typeof className === 'string',
            })}
        >
            {msg}
        </div>
    );
};

export default ErrorMsg;
