using Backend.Models;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IBaseService<TEntity, TDto, TCreateDto, TUpdateDto> 
        where TEntity : BaseEntity
    {
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TCreateDto createDto);
        Task<TDto?> UpdateAsync(int id, TUpdateDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
