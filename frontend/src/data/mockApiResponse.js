// src/data/mockApiResponse.js

export const mockApiResponse = [
    {
      id: 1,
      day: 1,
      date: '2025-12-10',
      location: "Old Library (Interior)",
      generalCall: '08:00',
      firstShot: '09:00',
      estWrap: '20:00',
      weather: 'Rainy, 18°C',
      sunrise: '06:45',
      sunset: '18:00',
      notes: "Generated from script. Focus on dusty, atmospheric lighting.",
      scenes: [
        { sceneNumber: '14', description: 'INT. OLD LIBRARY - DAY. Protagonist discovers the ancient book.', cast: ['Elara', 'Librarian'], startTime: '09:00', endTime: '12:00' },
        { sceneNumber: 'LUNCH', description: 'Lunch Break', cast: [], startTime: '12:30', endTime: '13:30' },
        { sceneNumber: '15', description: 'INT. OLD LIBRARY - DAY. Elara is confronted by the antagonist.', cast: ['Elara', 'Kael'], startTime: '14:00', endTime: '19:00' },
      ],
      castCalls: [
        { character: 'Elara', actor: 'TBD', status: 'W', hmw: '07:00', onSet: '08:30' },
        { character: 'Kael', actor: 'TBD', status: 'SW', hmw: '12:00', onSet: '13:30' },
        { character: 'Librarian', actor: 'TBD', status: 'SW', hmw: '08:00', onSet: '09:00' },
      ]
    },
    {
      id: 2,
      day: 2,
      date: '2025-12-11',
      location: "City Rooftop (Night)",
      generalCall: '17:00',
      firstShot: '18:30',
      estWrap: '04:00',
      weather: 'Clear Night, 15°C',
      sunrise: '06:46',
      sunset: '18:00',
      notes: "Generated from script. Stunt coordinator required for chase sequence.",
      scenes: [
        { sceneNumber: '22A', description: 'EXT. CITY ROOFTOP - NIGHT. Elara escapes across the rooftops.', cast: ['Elara', 'Stunt Double'], startTime: '18:30', endTime: '23:00' },
        { sceneNumber: 'DINNER', description: 'Dinner Break', cast: [], startTime: '23:00', endTime: '00:00' },
        { sceneNumber: '22B', description: 'EXT. ALLEYWAY - NIGHT. Elara corners Kael.', cast: ['Elara', 'Kael'], startTime: '00:30', endTime: '03:30' },
      ],
      castCalls: [
        { character: 'Elara', actor: 'TBD', status: 'W', hmw: '16:00', onSet: '17:30' },
        { character: 'Kael', actor: 'TBD', status: 'W', hmw: '22:00', onSet: '23:30' },
      ]
    }
];