using Backend.Models;
using Backend.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    public abstract class BaseService<TEntity, TDto, TCreateDto, TUpdateDto> : IBaseService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : BaseEntity
    {
        protected readonly DbContext _context;

        protected BaseService(DbContext context)
        {
            _context = context;
        }

        public abstract Task<PagedResult<TDto>> GetAllAsync(SearchFilter filter);
        public abstract Task<TDto> GetByIdAsync(int id);
        public abstract Task<TDto> CreateAsync(TCreateDto createDto);
        public abstract Task<TDto> UpdateAsync(int id, TUpdateDto updateDto);

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Set<TEntity>().FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            entity.DeletedBy = 1; // TODO: get from auth context

            await _context.SaveChangesAsync();
            return true;
        }
    }
}