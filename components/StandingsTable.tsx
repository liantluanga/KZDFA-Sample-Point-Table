import React from 'react';
import type { Group, Team } from '../types';
import EditableField from './EditableField';
import TeamRow from './TeamRow';

interface StandingsTableProps {
  group: Group;
  onGroupUpdate: (groupIndex: number, updatedGroup: Partial<Group>) => void;
  onTeamUpdate: (groupIndex: number, teamIndex: number, updatedTeam: Partial<Team>) => void;
  groupIndex: number;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ group, onGroupUpdate, onTeamUpdate, groupIndex }) => {
  const headers = ["P", "W", "D", "L", "F", "A", "GD", "PTS"];

  return (
    <div className="bg-[#18181b] p-6 rounded-2xl w-full">
      <div className="grid grid-cols-[3fr_repeat(8,1fr)] items-center gap-x-4 mb-3">
          <EditableField
            value={group.name}
            onChange={(val) => onGroupUpdate(groupIndex, { name: val as string })}
            className="text-2xl font-bold text-[#14f1d9] col-span-1 text-left"
          />
        {headers.map((header) => (
          <div key={header} className={`text-center font-semibold ${header === 'PTS' ? 'text-[#14f1d9]' : 'text-gray-400'}`}>
            {header}
          </div>
        ))}
      </div>
      <div>
        {group.teams.map((team, teamIndex) => (
          <TeamRow
            key={team.id}
            team={team}
            onTeamUpdate={(updatedTeam) => onTeamUpdate(groupIndex, teamIndex, updatedTeam)}
            onLogoUpdate={(dataUrl) => onTeamUpdate(groupIndex, teamIndex, {logo: dataUrl})}
          />
        ))}
      </div>
    </div>
  );
};

export default StandingsTable;
