using AutoMapper;
using Backend.Models;
using Backend.Dtos.Observation;
using Backend.Dtos.Audit;
using Backend.Dtos.Permit;

namespace Backend.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Observation mappings
            CreateMap<Observation, ObservationDto>()
                .ForMember(dest => dest.ReportedByUserName, opt => opt.MapFrom(src => src.ReportedByUser.Name))
                .ForMember(dest => dest.ReportedByUserEmail, opt => opt.MapFrom(src => src.ReportedByUser.Email))
                .ForMember(dest => dest.AssignedToUserName, opt => opt.MapFrom(src => src.AssignedToUser != null ? src.AssignedToUser.Name : null))
                .ForMember(dest => dest.AssignedToUserEmail, opt => opt.MapFrom(src => src.AssignedToUser != null ? src.AssignedToUser.Email : null))
                .ForMember(dest => dest.PlantName, opt => opt.MapFrom(src => src.Plant != null ? src.Plant.Name : null))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null));

            CreateMap<CreateObservationDto, Observation>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ObservationStatus.Open));

            CreateMap<UpdateObservationDto, Observation>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Audit mappings
            CreateMap<Audit, AuditDto>()
                .ForMember(dest => dest.AuditorName, opt => opt.MapFrom(src => src.Auditor.Name))
                .ForMember(dest => dest.AuditorEmail, opt => opt.MapFrom(src => src.Auditor.Email))
                .ForMember(dest => dest.PlantName, opt => opt.MapFrom(src => src.Plant != null ? src.Plant.Name : null))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null));

            CreateMap<CreateAuditDto, Audit>();

            CreateMap<UpdateAuditDto, Audit>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Permit mappings
            CreateMap<Permit, PermitDto>()
                .ForMember(dest => dest.RequestedByUserName, opt => opt.MapFrom(src => src.RequestedByUser.Name))
                .ForMember(dest => dest.RequestedByUserEmail, opt => opt.MapFrom(src => src.RequestedByUser.Email))
                .ForMember(dest => dest.ApprovedByUserName, opt => opt.MapFrom(src => src.ApprovedByUser != null ? src.ApprovedByUser.Name : null))
                .ForMember(dest => dest.ApprovedByUserEmail, opt => opt.MapFrom(src => src.ApprovedByUser != null ? src.ApprovedByUser.Email : null))
                .ForMember(dest => dest.ResponsibleEngineerName, opt => opt.MapFrom(src => src.ResponsibleEngineer != null ? src.ResponsibleEngineer.Name : null))
                .ForMember(dest => dest.ResponsibleEngineerEmail, opt => opt.MapFrom(src => src.ResponsibleEngineer != null ? src.ResponsibleEngineer.Email : null))
                .ForMember(dest => dest.PlantName, opt => opt.MapFrom(src => src.Plant != null ? src.Plant.Name : null))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null));

            CreateMap<PermitType, PermitTypeDto>();
            CreateMap<CreatePermitTypeDto, PermitType>();
            CreateMap<UpdatePermitTypeDto, PermitType>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreatePermitDto, Permit>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => PermitStatus.Draft));

            CreateMap<UpdatePermitDto, Permit>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}