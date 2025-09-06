using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantController : ControllerBase
    {
        private readonly SafetyDbContext _context;

        public PlantController(SafetyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPlants()
        {
            try
            {
                var plants = await _context.Plants
                    .Include(p => p.Departments)
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.Name)
                    .ToListAsync();

                var response = new
                {
                    success = true,
                    data = plants.Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        code = p.Code,
                        location = p.Location,
                        isActive = p.IsActive,
                        departmentsCount = p.Departments.Count(d => d.IsActive),
                        createdAt = p.CreatedAt
                    }),
                    message = "Plants retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlant(int id)
        {
            try
            {
                var plant = await _context.Plants
                    .Include(p => p.Departments)
                    .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

                if (plant == null)
                {
                    return NotFound(new { success = false, message = "Plant not found" });
                }

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = plant.Id,
                        name = plant.Name,
                        code = plant.Code,
                        location = plant.Location,
                        isActive = plant.IsActive,
                        departments = plant.Departments.Where(d => d.IsActive).Select(d => new
                        {
                            id = d.Id,
                            name = d.Name,
                            code = d.Code,
                            isActive = d.IsActive
                        }),
                        createdAt = plant.CreatedAt,
                        updatedAt = plant.UpdatedAt
                    },
                    message = "Plant retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly SafetyDbContext _context;

        public DepartmentController(SafetyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments([FromQuery] int? plantId = null)
        {
            try
            {
                var query = _context.Departments
                    .Include(d => d.Plant)
                    .Where(d => d.IsActive);

                if (plantId.HasValue)
                {
                    query = query.Where(d => d.PlantId == plantId.Value);
                }

                var departments = await query
                    .OrderBy(d => d.Plant.Name)
                    .ThenBy(d => d.Name)
                    .ToListAsync();

                var response = new
                {
                    success = true,
                    data = departments.Select(d => new
                    {
                        id = d.Id,
                        name = d.Name,
                        code = d.Code,
                        plantId = d.PlantId,
                        plant = new { id = d.Plant.Id, name = d.Plant.Name, code = d.Plant.Code },
                        isActive = d.IsActive,
                        createdAt = d.CreatedAt
                    }),
                    message = "Departments retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            try
            {
                var department = await _context.Departments
                    .Include(d => d.Plant)
                    .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

                if (department == null)
                {
                    return NotFound(new { success = false, message = "Department not found" });
                }

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = department.Id,
                        name = department.Name,
                        code = department.Code,
                        plantId = department.PlantId,
                        plant = new { id = department.Plant.Id, name = department.Plant.Name, code = department.Plant.Code, location = department.Plant.Location },
                        isActive = department.IsActive,
                        createdAt = department.CreatedAt,
                        updatedAt = department.UpdatedAt
                    },
                    message = "Department retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly SafetyDbContext _context;

        public UserController(SafetyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string? role = null, [FromQuery] int? plantId = null, [FromQuery] int? departmentId = null)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.Plant)
                    .Include(u => u.Department)
                    .Where(u => u.IsActive);

                if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, out var userRole))
                {
                    query = query.Where(u => u.UserType == userRole);
                }

                if (plantId.HasValue)
                {
                    query = query.Where(u => u.PlantId == plantId.Value);
                }

                if (departmentId.HasValue)
                {
                    query = query.Where(u => u.DepartmentId == departmentId.Value);
                }

                var users = await query
                    .OrderBy(u => u.LastName)
                    .ThenBy(u => u.FirstName)
                    .ToListAsync();

                var response = new
                {
                    success = true,
                    data = users.Select(u => new
                    {
                        id = u.Id,
                        employeeId = u.EmployeeId,
                        email = u.Email,
                        firstName = u.FirstName,
                        lastName = u.LastName,
                        fullName = $"{u.FirstName} {u.LastName}",
                        userType = u.UserType.ToString(),
                        plantId = u.PlantId,
                        departmentId = u.DepartmentId,
                        plant = u.Plant == null ? null : new { id = u.Plant.Id, name = u.Plant.Name, code = u.Plant.Code },
                        department = u.Department == null ? null : new { id = u.Department.Id, name = u.Department.Name, code = u.Department.Code },
                        isActive = u.IsActive,
                        createdAt = u.CreatedAt
                    }),
                    message = "Users retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Plant)
                    .Include(u => u.Department)
                    .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = user.Id,
                        employeeId = user.EmployeeId,
                        email = user.Email,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        fullName = $"{user.FirstName} {user.LastName}",
                        userType = user.UserType.ToString(),
                        plantId = user.PlantId,
                        departmentId = user.DepartmentId,
                        plant = user.Plant == null ? null : new { id = user.Plant.Id, name = user.Plant.Name, code = user.Plant.Code, location = user.Plant.Location },
                        department = user.Department == null ? null : new { id = user.Department.Id, name = user.Department.Name, code = user.Department.Code },
                        isActive = user.IsActive,
                        createdAt = user.CreatedAt,
                        updatedAt = user.UpdatedAt
                    },
                    message = "User retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
