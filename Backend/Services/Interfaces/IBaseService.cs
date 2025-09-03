using Backend.Models;
using Backend.DTOs.Common;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces
{
    public interface IBaseService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : BaseEntity
    {
        Task<PagedResult<TDto>> GetAllAsync(SearchFilter filter);
        Task<TDto> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TCreateDto createDto);
        Task<TDto> UpdateAsync(int id, TUpdateDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}