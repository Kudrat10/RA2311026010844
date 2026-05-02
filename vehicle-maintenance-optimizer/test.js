// Vehicle Scheduler Test Cases
// Author: Kudrat Anand - RA2311026010844

const VehicleScheduler = require('./index');

function runTests() {
  console.log('=== Vehicle Maintenance Scheduler Tests ===\n');

  // Test 1: Basic scenario
  const scheduler1 = new VehicleScheduler();
  
  // Add vehicles (id, maintenanceTime, priority)
  scheduler1.addVehicle('V1', 2, 5);  // 2 hours, priority 5
  scheduler1.addVehicle('V2', 3, 8);  // 3 hours, priority 8
  scheduler1.addVehicle('V3', 4, 3);  // 4 hours, priority 3
  scheduler1.addVehicle('V4', 5, 10); // 5 hours, priority 10
  
  // Add depots (id, capacity in hours)
  scheduler1.addDepot('D1', 5);
  scheduler1.addDepot('D2', 8);
  
  const results1 = scheduler1.getResults();
  console.log('Test 1 - Basic Scenario:');
  console.log(`  Total vehicles: ${results1.summary.totalVehicles}`);
  console.log(`  Serviced vehicles: ${results1.summary.servicedVehicles}`);
  console.log(`  Efficiency: ${results1.summary.efficiency}`);
  console.log(`  Selected vehicles: ${results1.optimization.selectedVehicles.map(v => v.id).join(', ')}`);
  console.log();

  // Test 2: Capacity constraint
  const scheduler2 = new VehicleScheduler();
  
  scheduler2.addVehicle('V1', 6, 7);
  scheduler2.addVehicle('V2', 4, 9);
  scheduler2.addVehicle('V3', 3, 5);
  scheduler2.addVehicle('V4', 5, 8);
  
  scheduler2.addDepot('D1', 8);
  scheduler2.addDepot('D2', 5);
  
  const results2 = scheduler2.getResults();
  console.log('Test 2 - Capacity Constraint:');
  console.log(`  Total vehicles: ${results2.summary.totalVehicles}`);
  console.log(`  Serviced vehicles: ${results2.summary.servicedVehicles}`);
  console.log(`  Efficiency: ${results2.summary.efficiency}`);
  console.log(`  Selected vehicles: ${results2.optimization.selectedVehicles.map(v => v.id).join(', ')}`);
  console.log();

  // Test 3: All vehicles fit
  const scheduler3 = new VehicleScheduler();
  
  scheduler3.addVehicle('V1', 2, 4);
  scheduler3.addVehicle('V2', 3, 6);
  scheduler3.addVehicle('V3', 1, 3);
  
  scheduler3.addDepot('D1', 10);
  
  const results3 = scheduler3.getResults();
  console.log('Test 3 - All Vehicles Fit:');
  console.log(`  Total vehicles: ${results3.summary.totalVehicles}`);
  console.log(`  Serviced vehicles: ${results3.summary.servicedVehicles}`);
  console.log(`  Efficiency: ${results3.summary.efficiency}`);
  console.log(`  Selected vehicles: ${results3.optimization.selectedVehicles.map(v => v.id).join(', ')}`);
  console.log();

  // Test 4: Large dataset
  const scheduler4 = new VehicleScheduler();
  
  // Add 20 vehicles with random requirements
  const vehicleData = [
    { id: 'V1', time: 2, priority: 5 },
    { id: 'V2', time: 3, priority: 8 },
    { id: 'V3', time: 4, priority: 3 },
    { id: 'V4', time: 1, priority: 7 },
    { id: 'V5', time: 5, priority: 9 },
    { id: 'V6', time: 2, priority: 4 },
    { id: 'V7', time: 3, priority: 6 },
    { id: 'V8', time: 4, priority: 8 },
    { id: 'V9', time: 2, priority: 5 },
    { id: 'V10', time: 3, priority: 7 }
  ];
  
  vehicleData.forEach(v => scheduler4.addVehicle(v.id, v.time, v.priority));
  
  // Add multiple depots
  scheduler4.addDepot('D1', 8);
  scheduler4.addDepot('D2', 10);
  scheduler4.addDepot('D3', 6);
  
  const results4 = scheduler4.getResults();
  console.log('Test 4 - Large Dataset:');
  console.log(`  Total vehicles: ${results4.summary.totalVehicles}`);
  console.log(`  Serviced vehicles: ${results4.summary.servicedVehicles}`);
  console.log(`  Efficiency: ${results4.summary.efficiency}`);
  console.log(`  Total depot capacity: ${results4.summary.totalDepotCapacity}`);
  console.log();

  console.log('=== All Tests Completed ===');
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
