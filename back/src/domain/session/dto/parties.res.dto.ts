import { Parties } from '../type/parties.type';
import { IsNotEmpty } from 'class-validator';

export class PartiesResDto {
    @IsNotEmpty()
    parties: Parties;
}
