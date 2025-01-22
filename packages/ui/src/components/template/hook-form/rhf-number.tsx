import { useFormContext, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = Pick<
  TextFieldProps,
  | 'name'
  | 'label'
  | 'placeholder'
  | 'InputLabelProps'
  | 'InputProps'
  | 'fullWidth'
  | 'onChange'
  | 'error'
  | 'helperText'
  | 'disabled'
> & {
  name: string;
  maxValue?: number;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  returnAsString?: boolean;
};

export default function RHFNumber({
  name,
  maxValue,
  decimalScale = undefined,
  fixedDecimalScale = false,
  helperText,
  returnAsString = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <NumericFormat
          fullWidth
          customInput={TextField}
          allowLeadingZeros
          allowNegative={false}
          thousandSeparator=","
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          isAllowed={(values) => {
            const { floatValue } = values;
            if (maxValue && floatValue) return floatValue <= maxValue;
            return true;
          }}
          onChange={(event) => {
            if (returnAsString) field.onChange(event.target.value.replaceAll(/,/g, ''));
            else field.onChange(Number(event.target.value.replaceAll(/,/g, '')));
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
