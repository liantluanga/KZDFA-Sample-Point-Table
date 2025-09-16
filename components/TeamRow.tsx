import React from 'react';
import type { Team } from '../types';
import EditableField from './EditableField';
import ImageUploader from './ImageUploader';

interface TeamRowProps {
  team: Team;
  onTeamUpdate: (updatedTeam: Partial<Team>) => void;
  onLogoUpdate: (dataUrl: string | null) => void;
}

const TeamRow: React.FC<TeamRowProps> = ({ team, onTeamUpdate, onLogoUpdate }) => {
    const goalDifference = team.f - team.a;
    const points = team.w * 3 + team.d;

    return (
        <div className="grid grid-cols-[3fr_repeat(8,1fr)] items-center gap-x-4 text-xl h-14 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center gap-4">
                <ImageUploader 
                    imageUrl={team.logo}
                    onImageChange={onLogoUpdate}
                    shape="circle"
                    className="w-8 h-8 flex-shrink-0 bg-gray-700"
                />
                <EditableField value={team.name} onChange={(val) => onTeamUpdate({ name: val as string })} className="text-left font-semibold" />
            </div>
            
            <EditableField value={team.p} onChange={(val) => onTeamUpdate({ p: Number(val) })} inputType="number" className="text-center"/>
            <EditableField value={team.w} onChange={(val) => onTeamUpdate({ w: Number(val) })} inputType="number" className="text-center"/>
            <EditableField value={team.d} onChange={(val) => onTeamUpdate({ d: Number(val) })} inputType="number" className="text-center"/>
            <EditableField value={team.l} onChange={(val) => onTeamUpdate({ l: Number(val) })} inputType="number" className="text-center"/>
            <EditableField value={team.f} onChange={(val) => onTeamUpdate({ f: Number(val) })} inputType="number" className="text-center"/>
            <EditableField value={team.a} onChange={(val) => onTeamUpdate({ a: Number(val) })} inputType="number" className="text-center"/>

            <span className="text-center">{goalDifference > 0 ? `+${goalDifference}` : goalDifference}</span>
            <span className="text-center font-bold text-[#14f1d9]">{points}</span>
        </div>
    );
}

export default TeamRow;
