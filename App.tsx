import React, { useState, useCallback, useRef } from 'react';
import type { LeagueData, Group, Team } from './types';
import StandingsTable from './components/StandingsTable';
import EditableField from './components/EditableField';
import ImageUploader from './components/ImageUploader';

// This is needed because html-to-image is loaded from a script tag
declare const htmlToImage: any;

const initialLeagueData: LeagueData = {
  title: 'KZDFA',
  subTitle: '1st DIVISION LEAGUE 2025',
  matchDay: 1,
  date: '16-Aug-2025',
  groups: [
    {
      id: 1,
      name: 'GROUP A',
      teams: [
        { id: 101, name: 'Zuchhip FC', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 102, name: 'Kzl Electric FC', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 103, name: 'KIC Khawzawl FC', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 104, name: 'Vanchengpui GSA', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 105, name: 'Team Five', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
      ],
    },
    {
      id: 2,
      name: 'GROUP B',
      teams: [
        { id: 201, name: 'The PoleStar FC', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 202, name: 'Chalrang GSA', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 203, name: 'Kzl Vengthar GSA FC', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 204, name: 'FC Darngawn', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
        { id: 205, name: 'Team Ten', logo: null, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 },
      ],
    },
  ],
  footerText: 'Technical and Registration Committee',
  footerLogo: null,
  footerLogo2: null,
};


function App() {
  const [leagueData, setLeagueData] = useState<LeagueData>(initialLeagueData);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleLeagueDataChange = (field: keyof LeagueData, value: string | number | null) => {
    setLeagueData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleGroupUpdate = useCallback((groupIndex: number, updatedGroup: Partial<Group>) => {
    setLeagueData(prev => {
        const newGroups = [...prev.groups];
        newGroups[groupIndex] = {...newGroups[groupIndex], ...updatedGroup};
        return {...prev, groups: newGroups};
    });
  }, []);

  const handleTeamUpdate = useCallback((groupIndex: number, teamIndex: number, updatedTeam: Partial<Team>) => {
    setLeagueData(prev => {
        const newGroups = JSON.parse(JSON.stringify(prev.groups)); // Deep copy for nested state
        newGroups[groupIndex].teams[teamIndex] = { ...newGroups[groupIndex].teams[teamIndex], ...updatedTeam };
        return { ...prev, groups: newGroups };
    });
  }, []);

   const handleExport = useCallback(async (format: 'png' | 'jpeg') => {
    if (exportRef.current === null || isExporting) {
        return;
    }
    setIsExporting(true);
    try {
        const dataUrl = format === 'png' 
            ? await htmlToImage.toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 })
            : await htmlToImage.toJpeg(exportRef.current, { cacheBust: true, pixelRatio: 2, quality: 1 });
        
        const link = document.createElement('a');
        link.download = `league-standings-${Date.now()}.${format}`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Export failed:', err);
        alert('Could not export the image. Please try again.');
    } finally {
        setIsExporting(false);
    }
   }, [isExporting]);


  return (
    <div className="bg-gray-800 min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-[1080px] h-[1080px] bg-[#0D1117] text-white flex overflow-hidden shadow-2xl" ref={exportRef}>
            <div className="w-20 bg-[#14f1d9] flex items-center justify-center">
                <h2 className="text-4xl font-extrabold text-[#0D1117] uppercase transform -rotate-90 whitespace-nowrap tracking-[0.2em]">
                    Standings
                </h2>
            </div>

            <div className="flex-1 flex flex-col p-12">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-6xl font-extrabold">
                          <EditableField value={leagueData.title} onChange={(val) => handleLeagueDataChange('title', val)} className="w-full"/>
                        </h1>
                        <p className="text-5xl font-extrabold">
                          <EditableField value={leagueData.subTitle} onChange={(val) => handleLeagueDataChange('subTitle', val)} className="w-full"/>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-[#14f1d9] flex items-center gap-2 justify-end">
                            Match Day 
                            <EditableField value={leagueData.matchDay} onChange={(val) => handleLeagueDataChange('matchDay', val)} inputType="number" className="w-12"/>
                        </p>
                        <p className="text-lg text-gray-400">
                           <EditableField value={leagueData.date} onChange={(val) => handleLeagueDataChange('date', val)} />
                        </p>
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-8">
                    {leagueData.groups.map((group, index) => (
                        <StandingsTable 
                          key={group.id} 
                          group={group}
                          onGroupUpdate={handleGroupUpdate}
                          onTeamUpdate={handleTeamUpdate}
                          groupIndex={index}
                        />
                    ))}
                </main>
                
                <footer className="mt-auto flex justify-between items-end pt-8">
                    <div className="text-lg text-gray-400">
                        <EditableField value={leagueData.footerText} onChange={(val) => handleLeagueDataChange('footerText', val)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <ImageUploader
                            imageUrl={leagueData.footerLogo}
                            onImageChange={(val) => handleLeagueDataChange('footerLogo', val)}
                            shape="rectangle"
                            className="w-40 h-20 bg-gray-800"
                        />
                        <ImageUploader
                            imageUrl={leagueData.footerLogo2}
                            onImageChange={(val) => handleLeagueDataChange('footerLogo2', val)}
                            shape="rectangle"
                            className="w-40 h-20 bg-gray-800"
                        />
                    </div>
                </footer>
            </div>
        </div>
        
        <div className="mt-6 flex gap-4">
            <button onClick={() => handleExport('png')} disabled={isExporting} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isExporting ? 'Exporting...' : 'Export as PNG'}
            </button>
            <button onClick={() => handleExport('jpeg')} disabled={isExporting} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isExporting ? 'Exporting...' : 'Export as JPG'}
            </button>
        </div>
    </div>
  );
}

export default App;
