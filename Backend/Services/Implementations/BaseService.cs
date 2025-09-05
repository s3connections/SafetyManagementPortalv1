using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public abstract class BaseService<TEntity, TDto, TCreateDto, TUpdateDto> : IBaseService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : BaseEntity
    {
        protected readonly SafetyDbContext _context;
        protected readonly IMapper _mapper;
        protected readonly DbSet<TEntity> _dbSet;

        protected BaseService(SafetyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _dbSet = context.Set<TEntity>();
        }

        public virtual async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _dbSet.Where(x => x.IsActive).ToListAsync();
            return _mapper.Map<IEnumerable<TDto>>(entities);
        }

        public virtual async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
            return entity == null ? default : _mapper.Map<TDto>(entity);
        }

        public virtual async Task<TDto> CreateAsync(TCreateDto createDto)
        {
            var entity = _mapper.Map<TEntity>(createDto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<TDto>(entity);
        }

        public virtual async Task<TDto?> UpdateAsync(int id, TUpdateDto updateDto)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
            if (entity == null) return default;

            _mapper.Map(updateDto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return _mapper.Map<TDto>(entity);
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
            if (entity == null) return false;

            entity.IsActive = false;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public virtual async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(x => x.Id == id && x.IsActive);
        }
    }
}