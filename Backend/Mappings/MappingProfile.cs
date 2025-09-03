using AutoMapper;
using Backend.Models;
using Backend.DTOs.Observation;
using Backend.DTOs.Audit;

namespace Backend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Observation mappings
            CreateMap<Observation, ObservationDto>()
                .ForMember(dest => dest.ReporterName, opt => opt.MapFrom(src => src.Reporter.Name))
                .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src => src.Assignee != null ? src.Assignee.Name : ""))
                .ForMember(dest => dest.PlantName, opt => opt.MapFrom(src => src.Plant.Name))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name))
                .ForMember(dest => dest.HazardCategoryName, opt => opt.MapFrom(src => src.HazardCategory != null ? src.HazardCategory.Name : ""))
                .ForMember(dest => dest.HazardTypeName, opt => opt.MapFrom(src => src.HazardType != null ? src.HazardType.Name : ""));

            CreateMap<CreateObservationDto, Observation>()
                .ForMember(dest => dest.TicketNumber, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ObservationStatus.Open));

            CreateMap<UpdateObservationDto, Observation>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Audit mappings
            CreateMap<Audit, AuditDto>()
                .ForMember(dest => dest.AuditorName, opt => opt.MapFrom(src => src.Auditor.Name))
                .ForMember(dest => dest.PlantName, opt => opt.MapFrom(src => src.Plant.Name))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name));

            CreateMap<CreateAuditDto, Audit>()
                .ForMember(dest => dest.AuditNumber, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => AuditStatus.Scheduled));
        }
    }
}